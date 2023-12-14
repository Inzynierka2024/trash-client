import { BinTypes } from "../../../Models/BinTypes";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ElementColors } from "../../../Models/ElementColors";
import { ElementNames } from "../../../Models/ElementNames";
import { ElementIcons } from "../../../Models/ElementIcons";
import { ThemeContext } from "../../../../theme/theme";
import { useContext } from "react";

export const AddBinButton = (props: {
  type: BinTypes;
  newBin: Function;
  iconSize: number;
}) => {
  const themeFromContext = useContext(ThemeContext);

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={[
        styles.field,
        {
          backgroundColor: ElementColors[props.type],
        },
      ]}
      onPress={() => {
        props.newBin(props.type);
      }}
    >
      <Text
        style={[styles.label, { color: themeFromContext.colors.primaryText }]}
      >
        {ElementNames[props.type]}
      </Text>

      <Image source={ElementIcons[props.type]} style={styles.imageIcon} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  field: {
    flexDirection: "row",
    marginTop: 8,
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 8,
    marginRight: 48,
    borderRadius: 8,
    padding: 8,
  },
  imageIcon: {
    height: 32,
    width: 32,
  },
  label: {
    textAlign: "right",
    textShadowColor: "#0006",
    textShadowOffset: {
      width: 1,
      height: 1,
    },
    textShadowRadius: 4,
  },
});
