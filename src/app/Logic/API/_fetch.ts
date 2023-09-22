import { Alert } from "react-native";
import get_jwt_token from "../../Utils/get_jwt_token";

export default async function (
  url: string,
  method: "GET" | "POST" | "DELETE" | "PUT",
  headers: { [key: string]: string },
  body?: { [key: string]: string }
): Promise<{ isOk: true; data: any } | { isOk: false; error: string }> {
  const token = await get_jwt_token();

  console.log("Fetching: ", url);

  const response = await fetch(url, {
    method,
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
      "X-Access-Token": token,
      ...headers,
    },
    redirect: "follow",
    referrerPolicy: "no-referrer",
    body: body ? JSON.stringify(body) : undefined,
  });

  const code = await response.status;
  const isOk = await response.ok;
  const json = await response.json();

  if (isOk === true) return { isOk: true, data: json };
  else {
    Alert.alert(`${code} Error fetching: ${json.message}`);
    console.error(`${code} Error fetching: ${json.message}`);
    return { isOk: false, error: json.message };
  }
}
