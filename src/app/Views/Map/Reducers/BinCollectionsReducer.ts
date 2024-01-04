import { BinTypes } from "../../../Models/BinTypes";
import { MarkerData } from "../MapComponent";

export default function binCollectionsReducer(
  state: GeoJSON.FeatureCollection,
  action,
) {
  switch (action.type) {
    case "SET_BIN_COLLECTION":
      const type = action.payload.type as BinTypes;
      if (action.payload.markers.length > 0)
        console.log(`(Bin) ${action.payload.markers.length}x - ${type}`);

      const mapped = (action.payload.markers as MarkerData[]).map((feature) => {
        return {
          type: "Feature",
          id: feature.id,
          properties: {},
          geometry: {
            type: "Point",
            coordinates: [feature.longitude, feature.latitude],
          },
        };
      });

      return {
        ...state,
        [type]: {
          type: "FeatureCollection",
          features: mapped,
        },
      };
    case "CLEAR_BIN_COLLECTIONS":
      return initialBinCollections;
    default:
      return state;
  }
}

export const initialBinCollections: {
  [key in BinTypes]: GeoJSON.FeatureCollection;
} = {
  general: { type: "FeatureCollection", features: [] },
  bio: { type: "FeatureCollection", features: [] },
  plastic: { type: "FeatureCollection", features: [] },
  paper: { type: "FeatureCollection", features: [] },
  glass: { type: "FeatureCollection", features: [] },
  "e-waste": { type: "FeatureCollection", features: [] },
  pszok: { type: "FeatureCollection", features: [] },
  // debris: { type: "FeatureCollection", features: [] },
  cloth: { type: "FeatureCollection", features: [] },
  battery: { type: "FeatureCollection", features: [] },
};
