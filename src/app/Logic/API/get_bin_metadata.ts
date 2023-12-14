import _fetch from "./_fetch";
import { BinMetadata } from "../../Models/BinMetadata";
import api_to_BinMetadata from "../../Models/Converters/api_to_BinMetadata";

export default async function (id): Promise<BinMetadata> {
  const URL = `/bin/${id}`;

  const result = await _fetch(URL, "GET", {});

  return api_to_BinMetadata(result.data);
}
