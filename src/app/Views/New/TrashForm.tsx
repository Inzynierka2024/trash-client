import MapLibreGL from "@maplibre/maplibre-react-native";
import { useContext, useState } from "react";
import { View, Text, Image, Modal, Button } from "react-native";
import { ThemeContext } from "../../../theme/theme";
import { CameraContainer } from "./CameraContainer";
import { CameraButton } from "./CameraButton";

export const TrashForm = (props: { location: MapLibreGL.Location }) => {
  const themeFromContext = useContext(ThemeContext);

  const [imageData, setImageData] = useState("");

  async function sendForm() {
    const response = await fetch("https://httpbin.org/post", {
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
        lng: props.location.coords.longitude,
        lat: props.location.coords.latitude,
        image: imageData,
      }), // body data type must match "Content-Type" header
    });
    const json = await response.json();

    console.log("SEND: ", json);

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
      <CameraContainer setImageData={setImageData} enabled={imageData !== ""} />
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
            <Text>{props.location.coords.latitude}</Text>
            <Text>{props.location.coords.longitude}</Text>
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
              <CameraButton size={30} iconName="delete" onPress={() => {}} />
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
