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

export const rates = [
  { label: 90, value: 90 },
  { label: 100, value: 100 },
  { label: 110, value: 110 },
];

export const monthOptions = [
  { label: "Combined", value: "Combined" },
  { label: "January", value: "January" },
  { label: "February", value: "February" },
  { label: "March", value: "March" },
  { label: "April", value: "April" },
  { label: "May", value: "May" },
  { label: "June", value: "June" },
  { label: "July", value: "July" },
  { label: "August", value: "August" },
  { label: "September", value: "September" },
  { label: "October", value: "October" },
  { label: "November", value: "November" },
  { label: "December", value: "December" },
];

export const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
