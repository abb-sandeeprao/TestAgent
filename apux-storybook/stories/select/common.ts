export type Item = {
  value: string;
  content: string;
  selected?: boolean;
};

export const continentOptions: Item[] = [
  { value: "af", content: "Africa" },
  { value: "an", content: "Antarctica" },
  { value: "oc", content: "Oceania" },
  { value: "as", content: "Asia" },
  { value: "eu", content: "Europe" },
  { value: "na", content: "North America" },
  { value: "sa", content: "South America" },
];

export const longWordOptions: Item[] = [
  { value: "fl", content: "Floccinaucinihilipilification" },
  { value: "te", content: "Tergiversation" },
  { value: "in", content: "Incomprehensibility" },
  { value: "pn", content: "Pneumonoultramicroscopicsilicovolcanoconiosis" },
];
