import { useContext, useEffect, useState } from "react";
import { Button, Modal, View, Image, Text } from "react-native";
import remove_trash from "../../../Logic/API/remove_trash";
import { ThemeContext } from "../../../../theme/theme";
import MapLibreGL from "@maplibre/maplibre-react-native";
import { MarkerData } from "../MapComponent";
import { TrashMetadata } from "../../../Models/TrashMetadata";
import get_trash_metadata from "../../../Logic/API/get_trash_metadata";
import { Alert } from "react-native";
import calculate_distance from "../../../Utils/calculate_distance";
import { Loading } from "../../../Utils/Loading";
import { ElementCard } from "../../Card/ElementCard";
import { ElementColors } from "../../../Models/ElementColors";
import { BinMetadata } from "../../../Models/BinMetadata";
import get_bin_metadata from "../../../Logic/API/get_bin_metadata";

export const BinModal = (props: {
  currentBin: MarkerData;
  binModalVisible: boolean;
  onClose: Function;
}) => {
  const themeFromContext = useContext(ThemeContext);
  const textColor = themeFromContext.colors.primaryText;

  const [loading, setLoading] = useState(false);
  const [binData, setBinData] = useState<BinMetadata | null>(null);

  useEffect(() => {
    if (props.binModalVisible === true) {
      console.log(`Loading bin info: ${props.currentBin.id}`);
      setLoading(true);
      loadData();
    } else {
      clearData();
    }
  }, [props.binModalVisible]);

  function loadData() {
    if (props.currentBin && props.currentBin.id !== null)
      get_bin_metadata(props.currentBin.id).then((result) => {
        console.log(result);
        setBinData(result);
        setLoading(false);
      });
  }

  function clearData() {
    setBinData(null);
  }

  function closeBinModal() {
    props.onClose();
  }

  return (
    <Modal
      animationType="slide"
      visible={props.binModalVisible}
      onRequestClose={() => {
        closeBinModal();
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
        <Loading visible={loading} />

        <View
          style={{
            backgroundColor: themeFromContext.colors.background,
            borderWidth: 4,
            borderColor:
              ElementColors[binData !== null ? binData.Type : "general"],
            borderRadius: 4,
            alignSelf: "center",
            alignItems: "center",
            justifyContent: "center",
            gap: 16,
            marginBottom: 48,
          }}
        >
          {binData !== null && (
            <ElementCard
              type={binData.Type}
              timestamp={binData.CreationTimestamp}
              binStatus={binData.Status}
              imageEnabled={false}
            />
          )}
        </View>
      </View>
    </Modal>
  );
};
