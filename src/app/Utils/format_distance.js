export function formatDistance(distance) {
    if (distance < 1) {
        const meters = Math.round(distance * 1000);
        return `${meters} m`;
    } else {
        return `${distance.toFixed(2)} km`;
    }
}