export type BinStatus = "empty" | "medium" | "full" | "overfilled";

export const BinStatusNames: { [key in BinStatus]: string } = {
  empty: "Pusty",
  medium: "Normalny",
  full: "Pełny",
  overfilled: "Przepełniony",
};
