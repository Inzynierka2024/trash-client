import { TrashMetadata } from "../../Models/TrashMetadata";
import _fetch from "./_fetch";

export default async function (id): Promise<TrashMetadata> {
  const URL = `/garbage/${id}`;

  const result = await _fetch(URL, "GET", {});

  return {
    Id: parseInt(result.data["garbage_id"]),
    CreationTimestamp: new Date(result.data["creation_timestamp"]),
    Latitude: parseFloat(result.data["latitude"]),
    Longitude: parseFloat(result.data["longitude"]),
    Picture: result.data["picture"],
  };
}
