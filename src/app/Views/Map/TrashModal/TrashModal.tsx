import { useContext, useEffect, useState } from "react";
import { Button, Modal, View, Image } from "react-native";
import remove_trash from "../../../Logic/API/remove_trash";
import get_api_url from "../../../Utils/get_api_url";
import { ThemeContext } from "../../../../theme/theme";
import { ActionButton } from "./ActionButton";
import MapLibreGL from "@maplibre/maplibre-react-native";
import { MarkerData } from "../MapComponent";
import { TrashMetadata } from "../../../Models/TrashMetadata";
import get_trash_metadata from "../../../Logic/API/get_trash_metadata";

export const TrashModal = (props: {
  currentTrash: MarkerData;
  trashModalVisible: boolean;
  updateMapMarkers: Function;
  onClose: Function;
  userState: MapLibreGL.Location;
}) => {
  const themeFromContext = useContext(ThemeContext);
  const API_URL = get_api_url();

  const [currentTrashData, setCurrentTrashData] = useState<TrashMetadata>(null);

  useEffect(() => {
    if (props.trashModalVisible === true) {
      console.log(`Loading trash info: ${props.currentTrash.id}`);
      loadTrashMetadata();
    }
  }, [props.trashModalVisible]);

  async function loadTrashMetadata() {
    const result = await get_trash_metadata(API_URL, props.currentTrash.id);
    setCurrentTrashData(result);
  }

  function removeTrash() {
    remove_trash(API_URL, props.currentTrash.id)
      .then((data) => {
        console.log("Removed trash");
        props.updateMapMarkers();
      })
      .catch((err) => {
        console.log("Failed to remove trash");
      })
      .finally(() => {
        closeTrashModal();
      });
  }

  function closeTrashModal() {
    props.onClose();
  }

  function isTrashInRange() {
    if (!props.userState || !props.currentTrash) {
      return true;
    }
    const result =
      Math.abs(props.userState.coords.longitude - props.currentTrash.lng) <
        0.01 &&
      Math.abs(props.userState.coords.latitude - props.currentTrash.lat) < 0.01;
    console.log(result);
    return result;
  }

  const [canRemove, setCanRemove] = useState(false);

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
              uri: "data:image/jpg;base64," + currentTrashData.Picture,
            }}
            style={{
              aspectRatio: "9 / 16",
              height: 300,
              resizeMode: "contain",
            }}
          />

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
