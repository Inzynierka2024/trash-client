import _fetch from "./_fetch";
import {BinTypes} from "../../Models/BinTypes";
import {BinStatus} from "../../Models/BinStatus";

export default async function (locationData, type: BinTypes, status: BinStatus) {
    const URL = `/bin/`;

    console.log("Sending new bin to:", URL, locationData.coords);

    const result = await _fetch(
        URL,
        "POST",
        {},
        {
            lng: locationData.coords.longitude,
            lat: locationData.coords.latitude,
            type,
            status
        }
    );

    return result;
}
