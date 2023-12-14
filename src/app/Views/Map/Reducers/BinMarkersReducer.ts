export default function binMarkersReducer(markers, action) {
  switch (action.type) {
    case "SET_BIN_MARKERS":
      return action.payload;
    case "ADD_BIN_MARKER":
      const type = action.payload.type;
      console.log(`Parsed bin id=${action.payload.id} type=${type}`);

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
