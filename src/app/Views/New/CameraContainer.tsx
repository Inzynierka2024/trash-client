import { Camera, CameraType } from "expo-camera";
import { useContext, useEffect, useState } from "react";
import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { CameraButton } from "./CameraButton";
import { ThemeContext, theme } from "../../../theme/theme";

export const CameraContainer = () => {
  const themeFromContext = useContext(ThemeContext);

  const [type, setType] = useState(CameraType.back);
  const [permission, requestPermission] = Camera.useCameraPermissions();

  if (!permission) {
    return (
      <View>
        <Text>You need to give permission to use camera</Text>
        <Button
          onPress={() => {
            requestPermission();
          }}
          title="Give access"
        ></Button>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View>
        <Text>You need to give permission to use camera</Text>
        <Button
          onPress={() => {
            requestPermission();
          }}
          title="Give access"
        ></Button>
      </View>
    );
  }

  function toggleCameraType() {
    setType((current) =>
      current === CameraType.back ? CameraType.front : CameraType.back
    );
  }

  return (
    <View style={styles.container}>
      <Camera type={type} style={styles.camera}>
        <View style={styles.buttons}>
          <CameraButton iconName="photo-camera" size={30} onPress={() => {}} />
        </View>
      </Camera>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
  camera: {
    flex: 1,
  },
  buttons: {
    position: "absolute",
    bottom: 0,
    backgroundColor: "#0004",
    width: "100%",
    alignItems: "center",
    justifyContent: "space-around",
    paddingBottom: theme.spacing.l,
    paddingTop: theme.spacing.m,
  },
});
