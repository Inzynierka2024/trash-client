import MapLibreGL from "@maplibre/maplibre-react-native";
import { useContext, useState } from "react";
import { View, Text, Image, Modal, Button } from "react-native";
import { ThemeContext } from "../../../theme/theme";
import { CameraContainer } from "./CameraContainer";
import CardStyle from "../../Common/CardStyle";
import { CameraButton } from "./CameraButton";

export const TrashForm = (props: { location: MapLibreGL.Location }) => {
  const themeFromContext = useContext(ThemeContext);

  const [imageData, setImageData] = useState("");

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
              <CameraButton size={30} iconName="send" onPress={() => {}} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};
