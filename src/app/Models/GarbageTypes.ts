import { BinTypes } from "./BinTypes";

export const GarbageTypes: { [key in BinTypes]: string } = {
  general: "zmieszane",
  bio: "bio",
  plastic: "metale i tworzywa sztuczne",
  paper: "papierowe",
  glass: "szkło",
  "e-waste": "elektroodpady",
  cloth: "odzież",
  battery: "baterie",
  pszok: "PSZOK",
};
