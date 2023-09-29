import { useContext, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { ThemeContext, palette } from "../../../../theme/theme";
import { FontAwesome } from "@expo/vector-icons";

export const AddNewButton = (props: {
  newTrash: Function;
  newCan: Function;
}) => {
  const themeFromContext = useContext(ThemeContext);

  const [open, setOpen] = useState(false);

  const iconSize = 36;

  function onPress() {
    setOpen(!open);
  }

  return (
    <View style={styles.container}>
      <Pressable
        style={{
          ...styles.button,
          ...styles.garbagecan,
          borderRadius: iconSize,
          display: open ? "flex" : "none",
        }}
        onPress={() => {
          props.newTrash();
          setOpen(false);
        }}
      >
        <FontAwesome name="recycle" size={iconSize} style={styles.icon} />
      </Pressable>

      <Pressable
        style={{
          ...styles.button,
          ...styles.trash,
          borderRadius: iconSize,
          display: open ? "flex" : "none",
        }}
        onPress={() => {
          props.newTrash();
          setOpen(false);
        }}
      >
        <FontAwesome name="trash" size={iconSize} style={styles.icon} />
      </Pressable>

      <Pressable
        style={{
          ...styles.button,
          ...styles.menu,
          borderRadius: open ? 8 : iconSize,
        }}
        onPress={() => {
          onPress();
        }}
      >
        <FontAwesome name="plus" size={iconSize} style={styles.icon} />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    gap: 12,
  },
  button: {
    padding: 8,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 10,
    width: 54,
  },
  icon: {
    marginRight: 0,
    color: palette.white,
  },
  garbagecan: {
    backgroundColor: palette.darkyellow,
  },
  trash: {
    backgroundColor: palette.darkred,
  },
  menu: {
    backgroundColor: palette.darkgreen,
  },
});
