import MapLibreGL from "@maplibre/maplibre-react-native";
import calculate_distance from "./calculate_distance";

export default async function (
  center: any,
  userState: MapLibreGL.Location
): Promise<boolean> {
  const distance = calculate_distance(
    center[1],
    center[0],
    userState.coords.latitude,
    userState.coords.longitude
  );

  console.log(distance);

  const result = distance < 0.1;
  return result;
}
