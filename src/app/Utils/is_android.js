import { Platform } from "react-native";

export function is_android() {
  return Platform.OS === "android";
}
