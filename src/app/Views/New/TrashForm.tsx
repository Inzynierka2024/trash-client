import MapLibreGL from "@maplibre/maplibre-react-native";
import { useContext, useState } from "react";
import { View, Text, Image, Modal, Button } from "react-native";
import { ThemeContext } from "../../../theme/theme";
import { CameraContainer } from "./CameraContainer";
import { CameraButton } from "./CameraButton";
import create_new_trash from "../../Logic/API/create_new_trash";

export const TrashForm = (props: {
  location: MapLibreGL.Location;
  setModal: Function;
  updateMap: Function;
}) => {
  const themeFromContext = useContext(ThemeContext);

  const [locationData, setLocationData] = useState<MapLibreGL.Location>({
    coords: { latitude: 0, longitude: 0 },
  });
  const [imageData, setImageData] = useState("");

  function setData(imgData: string) {
    setImageData(imgData);
    setLocationData(props.location);
  }

  function close() {
    setImageData("");
  }

  function sendForm() {
    create_new_trash(locationData, imageData)
      .then((data) => {
        console.log("Trash added", data);
        close();
        props.updateMap();
        props.setModal(false);
      })
      .catch((err) => {
        console.error("Error when adding trash", err);
      });
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
