export default function binMarkersReducer(markers, action) {
  let type;
  switch (action.type) {
    case "SET_BIN_MARKERS":
      type = action.payload.type;
      return {
        ...markers,
        [type]: action.payload.markers,
      };
    case "ADD_BIN_MARKER":
      type = action.payload.type;

      return {
        ...markers,
        [type]: [...markers[type], action.payload],
      };
    case "CLEAR_BIN_MARKERS":
      return initialBinMarkers;
    default:
      return markers;
  }
}

export const initialBinMarkers = {
  general: [],
  bio: [],
  plastic: [],
  paper: [],
  glass: [],
  "e-waste": [],
  pszok: [],
  debris: [],
  cloth: [],
  battery: [],
};
