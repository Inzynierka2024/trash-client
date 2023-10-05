import { useContext, useState, useRef } from "react";
import { StyleSheet, View } from "react-native";
import { ThemeContext, palette } from "../../../../theme/theme";
import { Ionicons } from "@expo/vector-icons";
import AnimatedTouchable from "../../../Animated/AnimatedTouchable";

export const CenterButton = (props: { callback: Function }) => {
  const themeFromContext = useContext(ThemeContext);

  const iconSize = 26;

  return (
    <View style={styles.container}>
      <AnimatedTouchable
        onPress={() => {
          props.callback();
        }}
        style={[
          styles.button,
          {
            backgroundColor: themeFromContext.colors.background,
            borderColor: themeFromContext.colors.secondaryText,
          },
        ]}
      >
        <Ionicons
          name="locate-sharp"
          size={iconSize}
          style={[
            styles.icon,
            {
              color: themeFromContext.colors.primaryText,
            },
          ]}
        />
      </AnimatedTouchable>
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
    width: 64,
    borderRadius: 24,
    borderWidth: 2,
  },
  icon: {
    marginRight: 0,
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
