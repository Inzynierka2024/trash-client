import { Alert } from "react-native";
import get_jwt_token from "../../Utils/get_jwt_token";
import get_api_url from "../../Utils/get_api_url";
import { join } from "path";

export default async function (
  api_path: string,
  method: "GET" | "POST" | "DELETE" | "PUT",
  headers: { [key: string]: string },
  body?: { [key: string]: string },
): Promise<{
  isOk: boolean;
  data: any;
  error?: {
    message: string;
    details: string;
    code: number;
  };
}> {
  const base = await get_api_url();
  const token = await get_jwt_token();

  const url = join(base, api_path);

  console.log(`[${method}] ${url}`);

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

  // response.text().then((text) => {
  //   console.log("Response text:", text);
  // });

  const code = await response.status;
  const isOk = await response.ok;

  const json = await response.json();

  if (isOk === true) return { isOk: true, data: json };
  else {
    console.error(`${url} | ${code}: ${json.message}: ${json.details}`);
    console.log("Request that triggered error:", url, {
      ...body,
      image: json.image ? "!image data here!" : undefined,
    });
    return {
      isOk: false,
      data: {},
      error: {
        message: json.message,
        details: json.details,
        code: code,
      },
    };
  }
}
