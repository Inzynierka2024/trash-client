import _fetch from "./_fetch";
import { BinMetadata } from "../../Models/BinMetadata";
import api_to_BinMetadata from "../../Models/Converters/api_to_BinMetadata";
import { BinTypes } from "../../Models/BinTypes";

const STATIC_BINS_TABLE_TYPES = ["e-waste"];

export default async function (
  id: number,
  type: BinTypes,
): Promise<BinMetadata> {
  const URL = `/bin/${id}${
    STATIC_BINS_TABLE_TYPES.includes(type)
      ? `?${new URLSearchParams({
          type,
        })}`
      : ""
  }`;

  const result = await _fetch(URL, "GET", {});

  return api_to_BinMetadata(result.data);
}
