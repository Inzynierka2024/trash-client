import _fetch from "./_fetch";

export default async function (API_URL, id) {
  const URL = `http://${API_URL}/garbage/${id}/image`;
  console.log(URL);

  const result = await _fetch(URL, "GET", {});
  return result;
}
