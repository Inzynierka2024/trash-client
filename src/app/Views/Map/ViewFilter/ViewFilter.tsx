import {
  View,
  StyleSheet,
  Text,
  Pressable,
  TouchableOpacity,
} from "react-native";
import Modal from "react-native-modal";
import { useContext, useState } from "react";
import { palette, ThemeContext } from "../../../../theme/theme";
import { ElementMapMarkers } from "../../../Models/ElementMapMarkers";
import { FilterButton } from "./FilterButton";
import { ElementTypes } from "../../../Models/ElementTypes";
import { ElementNames } from "../../../Models/ElementNames";
import { ElementColors } from "../../../Models/ElementColors";
import { MaterialIcons } from "@expo/vector-icons";
import { GarbageTypes } from "../../../Models/GarbageTypes";
import capitalize from "../../../Utils/capitalize";

export const ViewFilter = (props: {
  toggleElementVisibility: Function;
  elementVisibilites: any;
}) => {
  const themeFromContext = useContext(ThemeContext);
  const textColor = themeFromContext.colors.primaryText;
  const secondaryText = themeFromContext.colors.secondaryText;
  const background = themeFromContext.colors.background;

  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View>
      <Pressable
        style={[
          styles.openButton,
          { backgroundColor: background, borderColor: secondaryText },
        ]}
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
        animationIn="slideInLeft"
        animationOut="slideOutLeft"
        isVisible={modalVisible}
        onBackButtonPress={() => {
          setModalVisible(false);
        }}
        backdropOpacity={0}
        onBackdropPress={() => {
          setModalVisible(false);
        }}
        style={[styles.modal]}
      >
        <View style={[styles.container, {}]}>
          <Text
            style={[
              styles.title,
              {
                color: textColor,
                backgroundColor: themeFromContext.colors.transparentBackground,
              },
            ]}
          >
            Pokaż na mapie:
          </Text>

          <FilterButton
            key={"garbage"}
            elementKey={"garbage"}
            toggleState={props.toggleElementVisibility}
            state={props.elementVisibilites["garbage"]}
            name={capitalize(GarbageTypes["garbage"])}
            color={ElementColors["garbage"]}
          />

          <Text
            style={[
              styles.subtitle,
              {
                color: textColor,
                backgroundColor: themeFromContext.colors.background,
              },
            ]}
          >
            pojemniki na:
          </Text>

          {Object.keys(ElementMapMarkers).map((key: ElementTypes) => {
            if (key === "garbage") return null;
            return (
              <FilterButton
                key={key}
                elementKey={key}
                toggleState={props.toggleElementVisibility}
                state={props.elementVisibilites[key]}
                name={capitalize(GarbageTypes[key])}
                color={ElementColors[key]}
              />
            );
          })}
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  modal: {
    width: "100%",
    paddingRight: 92,
  },
  container: {
    position: "absolute",
    left: 0,
    top: 0,
    margin: 0,
    width: "100%",
    flex: 1,
    flexDirection: "column",
    borderRadius: 8,
  },
  openButton: {
    width: 46,
    height: 46,
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
  subtitle: {
    padding: 8,
    textAlign: "center",
    fontSize: 16,
  },
});
