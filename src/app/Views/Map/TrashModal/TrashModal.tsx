import { useContext, useState } from "react";
import { Button, Modal, View, Image } from "react-native";
import remove_trash from "../../../Logic/API/remove_trash";
import get_api_url from "../../../Utils/get_api_url";
import { ThemeContext } from "../../../../theme/theme";
import { ActionButton } from "./ActionButton";

export const TrashModal = (props: {
  currentTrashId: number;
  currentTrashPhoto: string;
  trashModalVisible: boolean;
  updateMapMarkers: Function;
  onClose: Function;
}) => {
  const themeFromContext = useContext(ThemeContext);

  const API_URL = get_api_url();

  function removeTrash() {
    remove_trash(API_URL, props.currentTrashId)
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

  return (
    <Modal
      animationType="slide"
      visible={props.trashModalVisible}
      onRequestClose={() => {
        closeTrashModal();
      }}
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
            backgroundColor: "#cdcdcd",
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
              uri: "data:image/jpg;base64," + props.currentTrashPhoto,
            }}
            style={{
              aspectRatio: "9 / 16",
              height: 300,
              resizeMode: "contain",
            }}
          />

          <ActionButton iconName={"delete"} onPress={removeTrash} />
        </View>
      </View>
    </Modal>
  );
};
