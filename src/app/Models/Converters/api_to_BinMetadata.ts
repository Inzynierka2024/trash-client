import { BinMetadata } from "../BinMetadata";

export default function (data): BinMetadata {
  console.log("API?", data);
  return {
    Id: parseInt(data["bin_id"]) ?? parseInt(data["id"]),
    Username: data["username"],
    CreationTimestamp: data["creation_timestamp"]
      ? new Date(data["creation_timestamp"])
      : undefined,
    Latitude: parseFloat(data["latitude"]),
    Longitude: parseFloat(data["longitude"]),
    Type: data["type"],
    Status: data["status"],
  };
}
