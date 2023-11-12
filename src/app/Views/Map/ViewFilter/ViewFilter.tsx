import {
  View,
  StyleSheet,
  Modal,
  Text,
  Pressable,
  TouchableOpacity,
} from "react-native";
import { useContext, useState } from "react";
import { palette, ThemeContext } from "../../../../theme/theme";
import { ElementMapMarkers } from "../../../Models/ElementMapMarkers";
import { FilterButton } from "./FilterButton";
import { ElementTypes } from "../../../Models/ElementTypes";
import { ElementNames } from "../../../Models/ElementNames";
import { ElementColors } from "../../../Models/ElementColors";
import { MaterialIcons } from "@expo/vector-icons";

export const ViewFilter = (props: {
  toggleElementVisibility: Function;
  elementVisibilites: any;
}) => {
  const themeFromContext = useContext(ThemeContext);
  const textColor = themeFromContext.colors.primaryText;

  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View>
      <Pressable
        style={[styles.openButton]}
        onPress={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <MaterialIcons
          style={[{ color: textColor }]}
          name={modalVisible ? "close" : "filter-list"}
          size={30}
        />
      </Pressable>

      <Modal
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
        style={[styles.modal]}
      >
        <TouchableOpacity
          style={[{ flex: 1 }]}
          onPressOut={() => {
            setModalVisible(false);
          }}
          activeOpacity={1}
        >
          <View
            style={[
              styles.container,
              {
                backgroundColor: themeFromContext.colors.background,
              },
            ]}
          >
            <Text
              style={[
                styles.title,
                {
                  color: textColor,
                  backgroundColor: themeFromContext.colors.contrastOverlay,
                },
              ]}
            >
              Pokaż na mapie:
            </Text>
            {Object.keys(ElementMapMarkers).map((key: ElementTypes) => {
              return (
                <FilterButton
                  key={key}
                  elementKey={key}
                  toggleState={props.toggleElementVisibility}
                  state={props.elementVisibilites[key]}
                  name={ElementNames[key]}
                  color={ElementColors[key]}
                />
              );
            })}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  modal: {
    width: 260,
  },
  container: {
    position: "absolute",
    left: 0,
    margin: 12,
    width: 260,
    flex: 1,
    flexDirection: "column",
    borderRadius: 8,
  },
  openButton: {
    width: 46,
    height: 46,
    backgroundColor: "black",
    borderRadius: 23,
    justifyContent: "center",
    alignItems: "center",
    borderColor: palette.gray,
    borderWidth: 2,
  },
  title: {
    padding: 8,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
  },
});
