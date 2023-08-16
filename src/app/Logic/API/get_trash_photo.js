export default async function (API_URL, id) {
  const URL = `http://${API_URL}/get_image`;
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
      id,
    }), // body data type must match "Content-Type" header
  });

  // console.log(response);
  const json = await response.json();

  return json;
}
