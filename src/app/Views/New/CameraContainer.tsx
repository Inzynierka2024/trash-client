import { Camera, CameraType } from "expo-camera";
import { useContext, useEffect, useState } from "react";
import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { CameraButton } from "./CameraButton";
import { ThemeContext, theme } from "../../../theme/theme";

export const CameraContainer = (props: {
  setImageData: (data: string) => void;
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
        quality: 0.8,
      }).then((result) => {
        if (result.base64) props.setImageData(result.base64);
      });
    }
  }

  return (
    <View style={styles.container}>
      <Camera type={type} style={styles.camera} ref={(c) => (CameraRef = c)}>
        <View style={styles.buttons}>
          <CameraButton
            iconName="photo-camera"
            size={30}
            onPress={takePicture}
          />
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
