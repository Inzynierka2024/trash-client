export type BinStatus = "empty" | "normal" | "full" | "overfilled"

export const BinStatusNames : {[key in BinStatus]: string} = {
    empty: "Pusty",
    normal: "Normalny",
    full: "Pełny",
    overfilled: "Przepełniony"
}