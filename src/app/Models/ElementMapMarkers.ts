import generalMarker from "../../../assets/markers/marker.png";
import garbageMarker from "../../../assets/markers/marker-garbage.png";
import bioMarker from "../../../assets/markers/marker-bio.png";
import plasticMarker from "../../../assets/markers/marker-plastic.png";
import paperMarker from "../../../assets/markers/marker-paper.png";
import glassMarker from "../../../assets/markers/marker-glass.png";
import ewasteMarker from "../../../assets/markers/marker-ewaste.png";
import pszokMarker from "../../../assets/markers/marker-pszok.png";
import debrisMarker from "../../../assets/markers/marker-debris.png";
import clothMarker from "../../../assets/markers/marker-cloth.png";
import batteryMarker from "../../../assets/markers/marker-battery.png";
import { ElementTypes } from "./ElementTypes";

export const ElementMapMarkers: { [key in ElementTypes]: any } = {
  garbage: garbageMarker,

  general: generalMarker,
  bio: bioMarker,
  plastic: plasticMarker,
  paper: paperMarker,
  glass: glassMarker,
  battery: batteryMarker,
  cloth: clothMarker,

  "e-waste": ewasteMarker,
  // debris: debrisMarker,
  pszok: pszokMarker,
};
