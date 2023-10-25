import AsyncStorage from "@react-native-async-storage/async-storage";

const DEFAULT_URL = "http://192.168.1.109:5000";

export default async function get_api_url(): Promise<string> {
  const url = await AsyncStorage.getItem("API_URL");

  if (!url) {
    await AsyncStorage.setItem("API_URL", DEFAULT_URL);
    return DEFAULT_URL;
  }
  return url;
}
