import { TrashMetadata } from "../../Models/TrashMetadata";
import _fetch from "./_fetch";
import { Address } from "../../Models/Address";

export default async function (lat, lng): Promise<Address> {
  const URL = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&zoom=17`;

  const result = await fetch(URL, {
    method: "GET",
  }).then((response) => response.json());

  return result;
}
