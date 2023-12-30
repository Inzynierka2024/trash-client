import MapLibreGL from "@maplibre/maplibre-react-native";
import { useContext, useEffect, useState } from "react";
import { View, Text, Image, Modal, StyleSheet } from "react-native";
import { ThemeContext } from "../../../theme/theme";
import { CameraContainer } from "./CameraContainer";
import { CameraButton } from "./CameraButton";
import create_new_trash from "../../Logic/API/create_new_trash";
import { Loading } from "../../Utils/Loading";
import { ElementColors } from "../../Models/ElementColors";
import { ElementCard } from "../Card/ElementCard";
import { useAuth } from "../../Logic/AuthContext";

export const TrashForm = (props: {
  location: MapLibreGL.Location;
  setModal: Function;
  updateMap: Function;
}) => {
  const themeFromContext = useContext(ThemeContext);
  const background = themeFromContext.colors.background;
  const textColor = themeFromContext.colors.primaryText;

  const [locationData, setLocationData] = useState<MapLibreGL.Location>({
    coords: { latitude: 0, longitude: 0 },
  });
  const [imageData, setImageData] = useState("");

  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState<string | null>(null);

  const { getUserLogin } = useAuth();

  useEffect(() => {
    getUserLogin().then((value) => {
      setUsername(value);
    });
  }, []);

  function setData(imgData: string) {
    setLocationData(props.location);

    setImageData(imgData);
  }

  function close() {
    setImageData("");
  }

  function sendForm() {
    setLoading(true);

    create_new_trash(locationData, imageData)
      .then((data) => {
        console.log("Trash added", data);
        close();
        props.updateMap();
        props.setModal(false);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error when adding trash", err);
        setLoading(false);
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
          <Loading visible={loading} />

          <View
            style={{
              margin: 20,
              borderColor: ElementColors.garbage,
              borderWidth: 4,
              backgroundColor: background,
              borderRadius: 4,
              alignItems: "center",
              shadowColor: "#000",
              paddingVertical: 16,
            }}
          >
            <Text style={[styles.intentTitle, { color: textColor }]}>
              Zostanie dodany element:
            </Text>

            <ElementCard
              lat={locationData.coords.latitude}
              lng={locationData.coords.longitude}
              type="garbage"
              imageEnabled={true}
              imageData={imageData}
              timestamp={new Date()}
              addedBy={username}
            />

            <View
              style={{
                marginTop: 36,
                flexDirection: "row",
                width: "100%",
                gap: 32,
              }}
            >
              <CameraButton
                size={30}
                backgroundColor={themeFromContext.colors.danger}
                iconName="keyboard-return"
                onPress={() => {
                  close();
                }}
              />
              <CameraButton
                size={30}
                backgroundColor={themeFromContext.colors.primary}
                iconName="add-location"
                onPress={() => {
                  sendForm();
                }}
              />
            </View>

            <View
              style={{
                flexDirection: "row",
                width: 250,
                justifyContent: "center",
                gap: 16,
                marginTop: 12,
              }}
            >
              <Text
                style={{ color: textColor, width: 64, textAlign: "center" }}
                numberOfLines={1}
              >
                Anuluj
              </Text>
              <Text
                style={{ color: textColor, width: 64, textAlign: "center" }}
                numberOfLines={1}
              >
                Dodaj
              </Text>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  intentTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 12,
  },
  statusTitle: {
    fontSize: 14,
    fontWeight: "400",
    marginVertical: 12,
  },
});
