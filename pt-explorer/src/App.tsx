import { useEffect, useMemo, useState } from "react";
import logo from "./logo.svg";
import {
  VictoryAxis,
  VictoryChart,
  VictoryLabel,
  VictoryLine,
  VictoryTheme,
  VictoryZoomContainer,
} from "victory";
import "./App.css";
import { Dataset, filterDataset, groupDataset, loadDataset } from "./dataset";
import { formatISO, formatISO9075, fromUnixTime } from "date-fns";

const filters = {
  "wireless-headphones-for-mom": {
    labels: [{ allOf: ["wireless-headphones"] }],
    price: [{ lessThan: 8000 }],
  },
  "16gb-workstation-laptop": {
    labels: [
      { allOf: ["laptop", "16gb", "i7"] },
      { oneOf: ["nvidia", "geforce", "rtx", "gtx"] },
    ],
    price: [{ lessThan: 100000 }],
  },
  "32gb-workstation-laptop": {
    labels: [
      { allOf: ["laptop", "16gb", "i7"] },
      { oneOf: ["nvidia", "geforce", "rtx", "gtx"] },
    ],
    price: [{ lessThan: 100000 }],
  },
};

const colors = [
  "tomato",
  "royalblue",
  "mediumseagreen",
  "orange",
  "violet",
  "slateblue",
  "lightgray",
];

const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});
function App() {
  const [filterName, setFilterName] = useState<keyof typeof filters>(
    "wireless-headphones-for-mom"
  );
  const [dataset, setDataset] = useState<Dataset>([]);
  useEffect(() => {
    loadDataset().then(setDataset);
  }, []);
  const lines = useMemo(
    () => [
      ...Object.entries(
        filterDataset(groupDataset(dataset), filters[filterName])
      ),
    ],
    [dataset, filterName]
  );

  return (
    <div className="App">
      <header className="App-header">
        <VictoryChart
          theme={VictoryTheme.material}
          domainPadding={20}
          padding={60}
        >
          <VictoryAxis
            tickFormat={(x) => formatISO(fromUnixTime(x)).substring(0, 10)}
            crossAxis
            tickLabelComponent={<VictoryLabel angle={20} />}
          />
          <VictoryAxis
            dependentAxis
            tickFormat={(y) => formatter.format(y / 100)}
          />
          {lines.map(([id, data], idx) => (
            <VictoryLine
              key={id}
              data={data}
              style={{ data: { stroke: colors[idx % colors.length] } }}
              x="accessTime"
              y="price"
            />
          ))}
        </VictoryChart>
      </header>
      <nav>
        <select
          value={filterName}
          onChange={(e) =>
            setFilterName(e.target.value as keyof typeof filters)
          }
        >
          {Object.keys(filters).map((key) => (
            <option key={key}>{key}</option>
          ))}
        </select>
      </nav>
    </div>
  );
}

export default App;
