import MapLibreGL from "@maplibre/maplibre-react-native";
import { useContext, useEffect, useState } from "react";
import { View, Text, Image, Modal, Button, StyleSheet, ToastAndroid } from "react-native";
import { palette, ThemeContext } from "../../../theme/theme";
import { CameraContainer } from "./CameraContainer";
import { CameraButton } from "./CameraButton";
import create_new_trash from "../../Logic/API/create_new_trash";
import { Loading } from "../../Utils/Loading";
import add_new_bin from "../../Logic/API/add_new_bin";
import { BinStatus, BinStatusNames } from "../../Models/BinStatus";
import { BinTypes } from "../../Models/BinTypes";
import { ElementCard } from "../Card/ElementCard";
import { ElementColors } from "../../Models/ElementColors";
import { BinStatusButtons } from "../Map/Buttons/BinStatusButtons";
import { useAuth } from "../../Logic/AuthContext";

export const BinForm = (props: {
  location: MapLibreGL.Location;
  type: BinTypes;
  setModal: Function;
  updateMap: Function;
}) => {
  const themeFromContext = useContext(ThemeContext);
  const background = themeFromContext.colors.background;
  const textColor = themeFromContext.colors.primaryText;

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<BinStatus>("medium");
  const [username, setUsername] = useState<string | null>(null);

  const { getUserLogin } = useAuth();

  useEffect(() => {
    getUserLogin().then((value) => {
      setUsername(value);
    });
  }, []);

  function close() {
    setStatus("medium");
    props.setModal(false);
  }

  function sendForm() {
    setLoading(true);

    add_new_bin(props.location, props.type, status)
      .then((data) => {
        console.log("Bin added", data);
        ToastAndroid.show(
          `Super! Otrzymałeś +${data.data.added_points} punktów.`,
          ToastAndroid.SHORT,
        );
        close();
        props.updateMap();
        props.setModal(false);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error when adding Bin", err);
        setLoading(false);
      });
  }

  return (
    <View
      style={{
        flex: 1,
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
            margin: 20,
            borderColor: ElementColors[props.type],
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
            lat={props.location.coords.latitude}
            lng={props.location.coords.longitude}
            type={props.type}
            imageEnabled={false}
            binStatus={status}
            timestamp={new Date()}
            addedBy={username}
          />

          <Text
            numberOfLines={1}
            style={[styles.statusTitle, { color: textColor }]}
          >
            Stan:
          </Text>
          <BinStatusButtons status={status} setStatus={setStatus} />

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
