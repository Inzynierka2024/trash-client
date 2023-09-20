export default async function (API_URL, id) {
  const URL = `http://${API_URL}/garbage/${id}`;

  console.log("Removing trash", URL, id);

  const response = await fetch(URL, {
    method: "DELETE", // *GET, POST, PUT, DELETE, etc.
    mode: "cors", // no-cors, *cors, same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "same-origin", // include, *same-origin, omit
    headers: {
      "Content-Type": "application/json",
      "x-access-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwdWJsaWNfaWQiOiJkZWRmYjJiYy0wMDgxLTQxODctODJjZS1jNjFiZjc4MjgzNmIiLCJleHAiOjE2OTUyMzI1MTN9.Fuk8jryxS-gVVwhmyLfgRPbN1cXxF9DRo78TITXodVI"
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: "follow", // manual, *follow, error
    referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
  });
  const json = await response.json();

  return json;
}
