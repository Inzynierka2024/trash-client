import { Camera, CameraType } from "expo-camera";
import { useContext, useEffect, useState } from "react";
import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ThemeContext, theme } from "../../../theme/theme";
import { ShutterButton } from "./ShutterButton";
import { Loading } from "../../Utils/Loading";

export const CameraContainer = (props: {
  setData: (data: string) => void;
  enabled: boolean;
}) => {
  const themeFromContext = useContext(ThemeContext);
  const textColor = themeFromContext.colors.primaryText;
  const backgroundColor = themeFromContext.colors.background;
  const secondaryText = themeFromContext.colors.secondaryText;

  const [loading, setLoading] = useState(false);

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
      setLoading(true);

      CameraRef.takePictureAsync({
        base64: true,
        // TODO: maybe look at how low we can go for bandwidth
        quality: 0.5,
      }).then((result) => {
        if (result.base64) props.setData(result.base64);
        setLoading(false);
      });
    }
  }

  return (
    <View style={styles.container}>
      <Loading visible={loading} />

      <Text style={styles.title}>Dodawanie odpadu</Text>
      <Text style={styles.subtitle}>Zrób zdjęcie odpadu</Text>

      <Camera
        type={CameraType.back}
        style={styles.camera}
        ref={(c) => (CameraRef = c)}
      >
        <TouchableOpacity
          style={[
            styles.continue,
            {
              backgroundColor,
              borderColor: secondaryText,
            },
          ]}
        >
          <Text
            style={[
              styles.continueText,
              {
                color: textColor,
              },
            ]}
            numberOfLines={1}
            onPress={() => {
              props.setData("");
            }}
          >
            Kontynuuj bez zdjęcia
          </Text>
        </TouchableOpacity>
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
    position: "absolute",
    width: "100%",
    height: "100%",

    top: 0,
    left: 0,
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
    height: 92,
  },
  continue: {
    position: "absolute",
    bottom: 92,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
    marginBottom: 8,
    borderRadius: 8,
    backgroundColor: "red",
    borderWidth: 2,
    borderStyle: "solid",
  },
  continueText: {
    fontSize: 16,
  },
  title: {
    position: "absolute",
    zIndex: 9999,
    top: 16,
    width: "100%",
    color: "white",
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    textShadowColor: "black",
    textShadowRadius: 4,
    textShadowOffset: { width: 2, height: 2 },
  },
  subtitle: {
    position: "absolute",
    zIndex: 9999,
    top: 48,
    width: "100%",
    color: "white",
    textAlign: "center",
    fontSize: 16,
    textShadowColor: "black",
    textShadowRadius: 4,
    textShadowOffset: { width: 2, height: 2 },
  },
});
