import { useContext, useEffect, useState } from "react";
import { Button, View, Image, Text, ToastAndroid } from "react-native";
import remove_trash from "../../../Logic/API/remove_trash";
import { ThemeContext } from "../../../../theme/theme";
import { ActionButton } from "./ActionButton";
import MapLibreGL from "@maplibre/maplibre-react-native";
import { MarkerData } from "../MapComponent";
import { TrashMetadata } from "../../../Models/TrashMetadata";
import get_trash_metadata from "../../../Logic/API/get_trash_metadata";
import { Alert } from "react-native";
import calculate_distance from "../../../Utils/calculate_distance";
import round from "../../../Utils/round";
import { Loading } from "../../../Utils/Loading";
import { ElementCard } from "../../Card/ElementCard";
import { ElementColors } from "../../../Models/ElementColors";
import Modal from "react-native-modal";

export const TrashModal = (props: {
  currentTrash: MarkerData;
  trashModalVisible: boolean;
  updateMapMarkers: Function;
  onClose: Function;
  userState: MapLibreGL.Location;
}) => {
  const themeFromContext = useContext(ThemeContext);
  const textColor = themeFromContext.colors.primaryText;

  const [currentTrashData, setCurrentTrashData] =
    useState<TrashMetadata | null>(null);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (props.trashModalVisible === true) {
      console.log(`Loading trash info: ${props.currentTrash.id}`);
      setLoading(true);
      loadTrashMetadata();
    } else {
      clearData();
    }
  }, [props.trashModalVisible]);

  useEffect(() => {
    if (currentTrashData) setCanRemove(isTrashInRange(currentTrashData));
  }, [props.userState]);

  function loadTrashMetadata() {
    get_trash_metadata(props.currentTrash.id).then((result) => {
      setCurrentTrashData(result);
      setCanRemove(isTrashInRange(result));
      setLoading(false);
    });
  }

  function clearData() {
    setDistance(-1);
    setCurrentTrashData(null);
  }

  function removeTrash() {
    remove_trash(props.currentTrash.id)
      .then((result) => {
        if (result.isOk) {
          console.log("Removed trash");
          ToastAndroid.show(
            `Super! Otrzymałeś +${result.data.added_points} punktów.`,
            ToastAndroid.SHORT,
          );
          props.updateMapMarkers();
        } else {
          Alert.alert("Błąd", "Nie udało się usunąć odpadu", [], {
            cancelable: true,
          });
        }
      })
      .finally(() => {
        closeTrashModal();
      });
  }

  function closeTrashModal() {
    props.onClose();
  }

  function isTrashInRange(currentTrashData: TrashMetadata | null): boolean {
    if (!props.userState || currentTrashData === null) {
      return false;
    }

    const distance = calculate_distance(
      props.userState.coords.latitude,
      props.userState.coords.longitude,
      currentTrashData.Latitude,
      currentTrashData.Longitude,
    );

    setDistance(distance);

    const result = distance < 0.2;

    return result;
  }

  const [canRemove, setCanRemove] = useState(false);
  const [distance, setDistance] = useState<number>(-1);

  return (
    <Modal
      animationIn="slideInUp"
      isVisible={props.trashModalVisible}
      onBackButtonPress={() => {
        closeTrashModal();
      }}
      onBackdropPress={() => {
        closeTrashModal();
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
          alignItems: "center",
          justifyContent: "center",
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
            marginBottom: 48,
          }}
        >
          {currentTrashData !== null && (
            <ElementCard
              lat={currentTrashData.Latitude}
              lng={currentTrashData.Longitude}
              type={"garbage"}
              timestamp={currentTrashData.CreationTimestamp}
              imageEnabled={true}
              imageData={currentTrashData.Picture}
              addedBy={currentTrashData.CreationUsername}
              distance={distance}
            />
          )}

          {!canRemove && (
            <Text style={{ color: textColor }}>
              Jesteś za daleko by usunąć element z mapy
            </Text>
          )}
          <View style={{ flexDirection: "row", gap: 12 }}>
            <ActionButton
              disabled={!canRemove}
              width={236}
              iconName={"delete"}
              onPress={removeTrash}
            />
          </View>
          <View style={{ flexDirection: "row", gap: 12 }}>
            <Text
              style={{
                color: textColor,
                textAlign: "center",
              }}
              numberOfLines={1}
            >
              Zbierz odpad
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
};
