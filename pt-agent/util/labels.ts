import { AgentLabels } from "./types";

export function extractLabels(title: string | null, labels: AgentLabels): Record<string, boolean> {
  const normalizedTitle = title?.toLowerCase() ?? "";
  const alwaysLabels = Object.fromEntries(labels.always.map(label => [label, true]));
  const sometimesLabels = Object.fromEntries(labels.sometimes.map(label => [label, normalizedTitle.includes(label)]));
  return {...alwaysLabels, ...sometimesLabels};
}
  