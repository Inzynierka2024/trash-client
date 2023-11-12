import { View, StyleSheet, Modal, Text } from "react-native";
import { useContext } from "react";
import { palette, ThemeContext } from "../../../../theme/theme";
import { ElementMapMarkers } from "../../../Models/ElementMapMarkers";
import { FilterButton } from "./FilterButton";
import { ElementTypes } from "../../../Models/ElementTypes";
import { ElementNames } from "../../../Models/ElementNames";
import { ElementColors } from "../../../Models/ElementColors";

export const ViewFilter = (props: {
  toggleElementVisibility: Function;
  elementVisibilites: any;
}) => {
  const themeFromContext = useContext(ThemeContext);
  const textColor = themeFromContext.colors.primaryText;

  return (
    <Modal transparent={true}>
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
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 0,
    margin: 12,
    width: 260,
    flex: 1,
    flexDirection: "column",
    borderRadius: 8,
  },
  title: {
    padding: 8,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
  },
});
