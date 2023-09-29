import MapLibreGL from "@maplibre/maplibre-react-native";

export default async function (
  center: any,
  userState: MapLibreGL.Location
): Promise<boolean> {
  const EPSILON = 0.0016;

  const result =
    Math.abs(center[0] - userState.coords.longitude) < EPSILON &&
    Math.abs(center[1] - userState.coords.latitude) < EPSILON;

  return result;
}
