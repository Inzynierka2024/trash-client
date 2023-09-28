import { TrashMetadata } from "../../Models/TrashMetadata";
import _fetch from "./_fetch";

export default async function (API_URL, id): Promise<TrashMetadata> {
  const URL = `http://${API_URL}/garbage/${id}`;

  const result = await _fetch(URL, "GET", {});

  return {
    Id: result.data["garbage_id"],
    CreationTimestamp: new Date(result.data["creation_timestamp"]),
    Latitude: result.data["latitude"],
    Longitude: result.data["longitude"],
    Picture: result.data["picture"],
  };
}
