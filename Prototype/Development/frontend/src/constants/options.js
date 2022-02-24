// for select options - data fields
export const animalTypes = [
  { label: "Cow", value: "Cow" },
  { label: "Heifer", value: "Heifer" },
  { label: "Child", value: "Child" },
];
export const animalStatuses = [
  { label: "Milking", value: "Milking" },
  { label: "Not Milking", value: "Not Milking" },
  { label: "Dead", value: "Dead" },
  { label: "Sold", value: "Sold" },
];
export const inventoryMetrics = [
  { label: "Discrete Quantity", value: "Discrete Quantity" },
  { label: "Volume", value: "Volume" },
  { label: "Weight", value: "Weight" },
];
export const metricUnits = {
  [inventoryMetrics[0].value]: [{ label: "Count", value: "Count" }],
  [inventoryMetrics[1].value]: [
    { label: "mL", value: "mL" },
    { label: "L", value: "L" },
  ],
  [inventoryMetrics[2].value]: [
    { label: "mg", value: "mg" },
    { label: "g", value: "g" },
    { label: "kg", value: "kg" },
  ],
};
