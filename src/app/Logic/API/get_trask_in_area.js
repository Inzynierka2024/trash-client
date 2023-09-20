export default async function (API_URL, bounds) {
  const c1 = bounds[0];
  const c2 = bounds[1];

  const c1lng = c1[0];
  const c1lat = c1[1];

  const c2lng = c2[0];
  const c2lat = c2[1];
  const URL = `http://${API_URL}/garbage`;
  console.log("Fetching:", URL);

  const response = await fetch(URL, {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    mode: "cors", // no-cors, *cors, same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "same-origin", // include, *same-origin, omit
    headers: {
      "Content-Type": "application/json",
    },
    redirect: "follow", // manual, *follow, error
    referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify({
      beglat: c1lat,
      beglng: c1lng,
      endlag: c2lat,
      endlng: c2lng,
    }), // body data type must match "Content-Type" header
  });

  // console.log(response);
  const json = await response.json();

  return json;
}
