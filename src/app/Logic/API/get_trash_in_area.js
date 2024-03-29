import _fetch from "./_fetch";

export default async function (bounds) {
  const c1 = bounds[0];
  const c2 = bounds[1];

  const beglng = c1[0];
  const beglat = c1[1];

  const endlng = c2[0];
  const endlat = c2[1];
  const URL =
    `/garbage?` +
    new URLSearchParams({
      beglat,
      beglng,

      endlat,
      endlng,
    });

  const result = await _fetch(URL, "GET", {});

  if (result.isOk && result.data["map_points"]) {
    console.log(`(Garbage) ${result.data["map_points"].length}x points`);
  }

  return result;
}
