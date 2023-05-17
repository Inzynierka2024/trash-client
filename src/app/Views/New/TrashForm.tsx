import MapLibreGL from "@maplibre/maplibre-react-native";
import { useContext, useState } from "react";
import { View, Text } from "react-native";
import { ThemeContext } from "../../../theme/theme";
import { CameraContainer } from "./CameraContainer";

export const TrashForm = (props: { location: MapLibreGL.Location }) => {
  const themeFromContext = useContext(ThemeContext);

  const [imageData, setImageData] = useState("");

  // image data is in base64 string
  function takePicture(imageData: string) {}

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: themeFromContext.colors.background,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {imageData === "" && <CameraContainer />}
      {imageData !== "" && (
        <>
          <Text>{props.location.coords.latitude}</Text>
          <Text>{props.location.coords.longitude}</Text>
        </>
      )}
    </View>
  );
};
