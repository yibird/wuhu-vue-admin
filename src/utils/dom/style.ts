export const addUnit = (value?: string | number, unit = "px") => {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (typeof value === "number") return `${value}${unit}`;
};
