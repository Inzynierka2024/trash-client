import _fetch from "./_fetch";
import { BinMetadata } from "../../Models/BinMetadata";

export default async function (id): Promise<BinMetadata> {
  const URL = `/bin/${id}`;

  const result = await _fetch(URL, "GET", {});

  console.log(result.data);
  return {
    Id: parseInt(result.data["bin_id"]) ?? parseInt(result.data["id"]),
    CreationTimestamp: new Date(result.data["creation_timestamp"]),
    Latitude: parseFloat(result.data["latitude"]),
    Longitude: parseFloat(result.data["longitude"]),
    Type: result.data["type"],
    Status: result.data["status"],
  };
}
