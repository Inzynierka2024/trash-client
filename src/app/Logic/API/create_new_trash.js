export default async function (API_URL, locationData, imageData) {
  const URL = `http://${API_URL}/add_garbage`;

  console.log("Sending new trash to:", URL, locationData.coords);

  const response = await fetch(URL, {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    mode: "cors", // no-cors, *cors, same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "same-origin", // include, *same-origin, omit
    headers: {
      "Content-Type": "application/json",
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: "follow", // manual, *follow, error
    referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify({
      lng: locationData.coords.longitude,
      lat: locationData.coords.latitude,
      image: imageData,
    }), // body data type must match "Content-Type" header
  });
  const json = await response.json();

  return json;
}
