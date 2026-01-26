const Colors = {
  primary: "#9C4A8B",
  backgroundColor: "#1f1d36",
  secondary: "#E9A6A6",
  accent1: "#EC2626", //red
  accent2: "#8f8e9a",
  placeholder: "#c4c4c4",
  accent3: "#9c4a8b",
  accent4: "#6865cd",
  lightGreen: "#00ff26",
  textColor: "#333",
  subtextColor: "#666",
}as const;

export default Colors;

export type ColorKey = keyof typeof Colors;
