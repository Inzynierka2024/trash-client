import { useContext, useEffect, useState } from "react";
import { Button, Modal, View, Image, Text } from "react-native";
import remove_trash from "../../../Logic/API/remove_trash";
import get_api_url from "../../../Utils/get_api_url";
import { ThemeContext } from "../../../../theme/theme";
import { ActionButton } from "./ActionButton";
import MapLibreGL from "@maplibre/maplibre-react-native";
import { MarkerData } from "../MapComponent";
import { TrashMetadata } from "../../../Models/TrashMetadata";
import get_trash_metadata from "../../../Logic/API/get_trash_metadata";
import { Alert } from "react-native";
import calculate_distance from "../../../Utils/calculate_distance";
import round from "../../../Utils/round";

export const TrashModal = (props: {
  currentTrash: MarkerData;
  trashModalVisible: boolean;
  updateMapMarkers: Function;
  onClose: Function;
  userState: MapLibreGL.Location;
}) => {
  const themeFromContext = useContext(ThemeContext);
  const API_URL = get_api_url();

  const [currentTrashData, setCurrentTrashData] =
    useState<TrashMetadata | null>(null);

  useEffect(() => {
    if (props.trashModalVisible === true) {
      console.log(`Loading trash info: ${props.currentTrash.id}`);
      loadTrashMetadata();
    } else {
      clearData();
    }
  }, [props.trashModalVisible]);

  useEffect(() => {
    if (currentTrashData) setCanRemove(isTrashInRange());
  }, [props.userState]);

  async function loadTrashMetadata() {
    const result = await get_trash_metadata(API_URL, props.currentTrash.id);
    setCurrentTrashData(result);
  }

  function clearData() {
    setDistance(-1);
    setCurrentTrashData(null);
  }

  function removeTrash() {
    remove_trash(API_URL, props.currentTrash.id)
      .then((result) => {
        if (result.isOk) {
          console.log("Removed trash");
          props.updateMapMarkers();
        } else {
          Alert.alert("Failed to remove trash");
        }
      })
      .finally(() => {
        closeTrashModal();
      });
  }

  function closeTrashModal() {
    props.onClose();
  }

  function isTrashInRange() {
    if (!props.userState || currentTrashData === null) {
      return true;
    }

    const distance = calculate_distance(
      props.userState.coords.latitude,
      props.userState.coords.longitude,
      currentTrashData.Latitude,
      currentTrashData.Longitude
    );

    setDistance(distance);

    const result = distance < 0.2;

    return result;
  }

  const [canRemove, setCanRemove] = useState(false);
  const [distance, setDistance] = useState<number>(-1);

  function onModalShow() {
    if (isTrashInRange()) setCanRemove(true);
    else setCanRemove(false);
  }

  return (
    <Modal
      animationType="slide"
      visible={props.trashModalVisible}
      onRequestClose={() => {
        closeTrashModal();
      }}
      onShow={onModalShow}
      transparent={true}
    >
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View
          style={{
            backgroundColor: themeFromContext.colors.background,
            borderColor: themeFromContext.colors.primary,
            borderWidth: 4,
            borderRadius: 20,
            alignSelf: "center",
            alignItems: "center",
            justifyContent: "center",
            padding: 24,
            gap: 32,
          }}
        >
          <Image
            source={{
              uri: "data:image/jpg;base64," + currentTrashData?.Picture,
            }}
            style={{
              aspectRatio: "9 / 16",
              height: 300,
              resizeMode: "contain",
            }}
          />

          <Text
            style={{
              color: themeFromContext.colors.secondaryText,
            }}
          >
            Odległość:
            {distance !== -1 ? round(distance, 2) : "-"}km
          </Text>

          <ActionButton
            disabled={!canRemove}
            iconName={"delete"}
            onPress={removeTrash}
          />
        </View>
      </View>
    </Modal>
  );
};
