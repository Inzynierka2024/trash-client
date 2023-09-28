import { Camera, CameraType } from "expo-camera";
import { useContext, useEffect, useState } from "react";
import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ThemeContext, theme } from "../../../theme/theme";
import { ShutterButton } from "./ShutterButton";

export const CameraContainer = (props: {
  setData: (data: string) => void;
  enabled: boolean;
}) => {
  const themeFromContext = useContext(ThemeContext);

  const [type, setType] = useState(CameraType.back);
  const [permission, requestPermission] = Camera.useCameraPermissions();

  if (!permission) {
    return (
      <View>
        <Text>You need to give permission to use camera</Text>
        <Button
          disabled={!props.enabled}
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

  let CameraRef: Camera = undefined;

  function takePicture() {
    if (CameraRef) {
      CameraRef.takePictureAsync({
        base64: true,
        // TODO: maybe look at how low we can go for bandwidth
        quality: 0.5,
      }).then((result) => {
        if (result.base64) props.setData(result.base64);
      });
    }
  }

  return (
    <View style={styles.container}>
      <Camera type={type} style={styles.camera} ref={(c) => (CameraRef = c)}>
        <View style={styles.buttons}>
          <ShutterButton onPress={takePicture} />
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
