import { useContext, useEffect, useState } from "react";
import { Button, View, Image, Text } from "react-native";
import remove_trash from "../../../Logic/API/remove_trash";
import { palette, ThemeContext } from "../../../../theme/theme";
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
import Modal from "react-native-modal";
import { BinStatus } from "../../../Models/BinStatus";
import { ActionButton } from "../TrashModal/ActionButton";
import update_bin_status from "../../../Logic/API/update_bin_status";
import { BinStatusButtons } from "../Buttons/BinStatusButtons";

export const BinModal = (props: {
  currentBin: MarkerData;
  binModalVisible: boolean;
  onClose: Function;
}) => {
  const themeFromContext = useContext(ThemeContext);
  const textColor = themeFromContext.colors.primaryText;

  const [loading, setLoading] = useState(false);
  const [binData, setBinData] = useState<BinMetadata | null>(null);

  const [statusOptionsVisible, setStatusOptionsVisible] = useState(false);
  const [newStatus, setNewStatus] = useState<BinStatus>("medium");

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
        setNewStatus(result.Status);
      });
  }

  function clearData() {
    setBinData(null);
    setNewStatus("medium");
    setStatusOptionsVisible(false);
  }

  function closeBinModal() {
    props.onClose();
  }

  return (
    <Modal
      animationIn="slideInUp"
      isVisible={props.binModalVisible}
      onBackButtonPress={() => {
        closeBinModal();
      }}
      onBackdropPress={() => {
        closeBinModal();
      }}
      backdropOpacity={0}
      style={{
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <View
        style={{
          width: 260,
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
            alignItems: "center",
            justifyContent: "center",
            gap: 16,
            flex: 1,
            position: "absolute",
            paddingBottom: 12,
          }}
        >
          {binData !== null && (
            <ElementCard
              type={binData.Type}
              timestamp={binData.CreationTimestamp}
              addedBy={binData.Username}
              binStatus={binData.Status}
              imageEnabled={false}
            />
          )}

          {!statusOptionsVisible && (
            <View style={{ flexDirection: "row", gap: 16 }}>
              <View
                style={{
                  flexDirection: "column",
                  gap: 8,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ActionButton
                  disabled={false}
                  width={48}
                  iconName={"update"}
                  backgroundColor={palette.lightyellow}
                  onPress={() => {
                    setStatusOptionsVisible(true);
                  }}
                />

                <Text
                  style={{
                    color: textColor,
                    textAlign: "center",
                  }}
                  numberOfLines={1}
                >
                  Zmień stan
                </Text>
              </View>
            </View>
          )}

          {statusOptionsVisible && (
            <View
              style={{
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                gap: 16,
              }}
            >
              <BinStatusButtons status={newStatus} setStatus={setNewStatus} />
              <View style={{ flexDirection: "row", gap: 16 }}>
                <View
                  style={{
                    flexDirection: "column",
                    gap: 8,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <ActionButton
                    disabled={false}
                    width={48}
                    iconName={"close"}
                    backgroundColor={palette.lightred}
                    onPress={() => {
                      setNewStatus(binData.Status);
                      setStatusOptionsVisible(false);
                    }}
                  />

                  <Text
                    style={{
                      color: textColor,
                      textAlign: "center",
                    }}
                    numberOfLines={1}
                  >
                    Anuluj
                  </Text>
                </View>

                <View
                  style={{
                    flexDirection: "column",
                    gap: 8,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <ActionButton
                    disabled={false}
                    width={48}
                    iconName={"check"}
                    onPress={() => {
                      update_bin_status(props.currentBin.id, newStatus).then(
                        (result) => {
                          setBinData(result.data);
                          setStatusOptionsVisible(false);
                        },
                      );
                    }}
                  />

                  <Text
                    style={{
                      color: textColor,
                      textAlign: "center",
                    }}
                    numberOfLines={1}
                  >
                    Potwierdź
                  </Text>
                </View>
              </View>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};
