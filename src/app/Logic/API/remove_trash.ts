import _fetch from "./_fetch";

export default async function (API_URL, id) {
  const URL = `http://${API_URL}/garbage/${id}`;

  console.log("Removing trash", URL, id);

  const result = await _fetch(URL, "DELETE", {});

  return result;
}
