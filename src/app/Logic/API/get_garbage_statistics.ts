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

    let monthCountMap = {};

    const fetchPromises = historyResult.data["map_points"].map(point => 
        _fetch(`/garbage/${point.id}`, "GET", {})
    );
    
    const results = await Promise.all(fetchPromises);
    
    results.forEach(detailResult => {
        if (detailResult.isOk) {
            const metadata = detailResult.data;
            
            const timestamp = metadata.creation_timestamp;
            if (timestamp) {
                const day = new Date(timestamp).getDate();
                const month = new Date(timestamp).getMonth() + 1;
                const year = new Date(timestamp).getFullYear();
                const yearMonth = `${year}-${month.toString().padStart(2, '0')}-${day}`; 
                
                monthCountMap[yearMonth] = (monthCountMap[yearMonth] || 0) + 1;
            }
        }
    });
    
    console.log("(History) ", monthCountMap);
    return monthCountMap;
    
}
