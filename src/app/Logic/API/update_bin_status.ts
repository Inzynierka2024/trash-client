import _fetch from "./_fetch";
import { BinTypes } from "../../Models/BinTypes";
import { BinStatus } from "../../Models/BinStatus";

export default async function (id: number, status: BinStatus) {
  const URL =
    `/bin/${id}?` +
    new URLSearchParams({
      status,
    });

  console.log(`Sending new bin status ${status} to:`, URL);

  const result = await _fetch(URL, "PUT", {}, {});

  return result;
}
