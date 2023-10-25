import _fetch from "./_fetch";

export default async function (locationData, imageData) {
  const URL = `/garbage/`;

  console.log("Sending new trash to:", URL, locationData.coords);

  const result = await _fetch(
    URL,
    "POST",
    {},
    {
      lng: locationData.coords.longitude,
      lat: locationData.coords.latitude,
      image: imageData,
    }
  );

  return result;
}
