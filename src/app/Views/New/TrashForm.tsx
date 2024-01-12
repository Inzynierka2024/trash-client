import MapLibreGL from "@maplibre/maplibre-react-native";
import { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { ThemeContext } from "../../../theme/theme";
import { CameraContainer } from "./CameraContainer";
import { CameraButton } from "./CameraButton";
import create_new_trash from "../../Logic/API/create_new_trash";
import { Loading } from "../../Utils/Loading";
import { ElementColors } from "../../Models/ElementColors";
import { ElementCard } from "../Card/ElementCard";
import { useAuth } from "../../Logic/AuthContext";
import Modal from "react-native-modal";

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
  const [imageData, setImageData] = useState<string | null>(null);

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
    setImageData(null);
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
      <CameraContainer setData={setData} enabled={imageData !== null} />
      <Modal
        animationIn="fadeIn"
        animationOut="fadeOut"
        isVisible={imageData !== null}
        onBackButtonPress={() => {
          close();
        }}
        onBackdropPress={() => {
          close();
        }}
        backdropOpacity={0}
        style={{
          alignItems: "center",
          justifyContent: "center",
        }}
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
              backgroundColor: themeFromContext.colors.background,
              borderWidth: 4,
              borderColor: ElementColors.garbage,
              borderRadius: 4,
              alignSelf: "center",
              alignItems: "center",
              justifyContent: "center",
              gap: 16,
              paddingBottom: 12,
            }}
          >
            <Text style={[styles.intentTitle, { color: textColor }]}>
              Zostanie dodany element:
            </Text>

            <ElementCard
              lat={locationData.coords.latitude}
              lng={locationData.coords.longitude}
              type="garbage"
              imageEnabled={imageData !== "" && imageData !== null}
              imageData={imageData}
              timestamp={new Date()}
              addedBy={username}
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
                justifyContent: "center",
                gap: 16,
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
    marginTop: 6,
  },
  statusTitle: {
    fontSize: 14,
    fontWeight: "400",
    marginVertical: 12,
  },
});
