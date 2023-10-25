import _fetch from "./_fetch";

export default async function (id) {
  const URL = `/garbage/${id}`;

  console.log("Removing trash", URL, id);

  const result = await _fetch(URL, "DELETE", {});

  return result;
}
