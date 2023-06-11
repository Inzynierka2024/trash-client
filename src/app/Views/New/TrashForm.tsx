import MapLibreGL from "@maplibre/maplibre-react-native";
import { useContext, useState } from "react";
import { View, Text, Image, Modal, Button } from "react-native";
import { ThemeContext } from "../../../theme/theme";
import { CameraContainer } from "./CameraContainer";
import { CameraButton } from "./CameraButton";
import get_api_url from "../../Utils/get_api_url";

export const TrashForm = (props: { location: MapLibreGL.Location }) => {
  const themeFromContext = useContext(ThemeContext);

  const [locationData, setLocationData] = useState<MapLibreGL.Location>({
    coords: { latitude: 0, longitude: 0 },
  });
  const [imageData, setImageData] = useState("");

  const API_URL = get_api_url();

  function setData(imgData: string) {
    setImageData(imgData);
    setLocationData(props.location);
  }

  async function sendForm() {
    console.log(API_URL);

    const response = await fetch(`${API_URL}/garbage`, {
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

    setImageData("");
  }

  function close() {
    setImageData("");
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: themeFromContext.colors.background,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <CameraContainer setData={setData} enabled={imageData !== ""} />
      <Modal
        transparent={true}
        visible={imageData !== ""}
        style={{ width: 100 }}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              margin: 20,
              backgroundColor: "white",
              borderRadius: 20,
              padding: 35,
              alignItems: "center",
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 4,
              elevation: 5,
            }}
          >
            <Text>{locationData.coords.latitude}</Text>
            <Text>{locationData.coords.longitude}</Text>
            <Image
              source={{
                uri: "data:image/jpg;base64," + imageData,
              }}
              style={{
                aspectRatio: "9 / 16",
                height: 300,
                resizeMode: "contain",
              }}
            />
            <View
              style={{
                flexDirection: "row",
                width: "100%",
                gap: 32,
              }}
            >
              <CameraButton
                size={30}
                iconName="delete"
                onPress={() => {
                  close();
                }}
              />
              <CameraButton
                size={30}
                iconName="send"
                onPress={() => {
                  sendForm();
                }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};
