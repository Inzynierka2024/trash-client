import _fetch from "./_fetch";
import { TrashMetadata } from "../../Models/TrashMetadata";

export default async function (begdate, enddate, bounds = [[180, 90], [-180, -90]]) {
    const c1 = bounds[0];
    const c2 = bounds[1];

    const beglng = '' + c1[0];
    const beglat = '' + c1[1];
    const endlng = '' + c2[0];
    const endlat = '' + c2[1];
    const URL = `/garbage/history?` + new URLSearchParams({
        beglat,
        beglng,
        endlat,
        endlng,
        begdate,
        enddate,
    });

    const historyResult = await _fetch(URL, "GET", {});
    if (!historyResult.isOk || !historyResult.data["map_points"]) {
        console.error("Failed to fetch garbage history");
        return null;
    }

    let typeCountMap = {};
    for (const point of historyResult.data["map_points"]) {
        const detailResult = await _fetch(`/garbage/${point.id}`, "GET", {});
        if (detailResult.isOk) {
            const metadata = (detailResult.data) ;
            const type = metadata.type || 'Unknown';
            typeCountMap[type] = (typeCountMap[type] || 0) + 1;
        }
    }
    console.log("(History) ", typeCountMap);
    return typeCountMap;
}