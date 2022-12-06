import parseISO from 'date-fns/parseISO'
import getUnixTime from 'date-fns/getUnixTime'

export type Dataset = Awaited<ReturnType<typeof loadDataset>>;
export type DataPoint = Dataset[number];

export async function loadDataset() {
  const points = await Promise.all([
    import("./data/out-2022-02-28T04:45:19-06:00.json"),
    import("./data/out-2022-02-28T18:15:52-06:00.json"),
    import("./data/out-2022-03-02T12:54:00-06:00.json"),
    import("./data/out-2022-03-03T11:19:52-06:00.json"),
    import("./data/out-2022-03-04T16:47:43-06:00.json"),
    import("./data/out-2022-03-06T15:38:24-06:00.json"),
  ]);
  const flatten = points.flatMap(p => p.default);
  return flatten.map(item => ({
    ...item,
    accessTime: getUnixTime(parseISO(item.accessTime))
  }))
}

type TagFilter =
  | { allOf: string[] }
  | { oneOf: string[] };

function tagFilter(tags: Record<string, boolean | undefined>, tagFilter: TagFilter) {
  if ("allOf" in tagFilter) {
    return tagFilter.allOf.every(item => tags?.[item]);
  } else if ("oneOf" in tagFilter) {
    return tagFilter.oneOf.some(item => tags?.[item]);
  } else {
    return true;
  }
}
type NumberFilter =
  | { lessThan: number }
  | { moreThan: number };

function numberFilter(num: number, numberFilter: NumberFilter) {
  if ("lessThan" in numberFilter) {
    return num < numberFilter.lessThan
  } else if ("moreThan" in numberFilter) {
    return numberFilter.moreThan < num
  } else {
    return true;
  }
}

type Filters = {
  labels?: TagFilter[];
  price?: NumberFilter[];
};

export function filterDataset(g: Record<string, DataPoint[]>, filters: Filters): Record<string, DataPoint[]> {
  return Object.fromEntries(Object.entries(g).filter(([id, items]) => items.some(item => (
    (filters?.labels ?? []).every((filter) => tagFilter(item.labels, filter)) &&
    (filters?.price ?? []).every((filter) => numberFilter(item.price, filter))
  ))));
}


export function groupDataset(dataset: Dataset): Record<string, DataPoint[]> {
  const groups: Record<string, DataPoint[]> = {};
  for (const item of dataset) {
    const id = `${item.vendor}-${item.id}`;
    if (!groups[id]) {
      groups[id] = []
    }
    groups[id].push(item);
  }
  return groups;
}