import { useContext, useState, useRef } from "react";
import { StyleSheet, View } from "react-native";
import { ThemeContext, palette } from "../../../../theme/theme";
import { Ionicons } from "@expo/vector-icons";
import AnimatedTouchable from "../../../Animated/AnimatedTouchable";

export const SearchNewButton = (props: { callback: Function }) => {
  const themeFromContext = useContext(ThemeContext);

  const iconSize = 26;
  const [disabled, setDisabled] = useState(false);

  return (
    <View style={styles.container}>
      <AnimatedTouchable
        disabled={disabled}
        onPress={() => {
          props.callback();

          // Throttle updating map
          setDisabled(true);
          setTimeout(() => {
            setDisabled(false);
          }, 5000);
        }}
        style={[
          styles.button,
          {
            backgroundColor: themeFromContext.colors.background,
            borderColor: themeFromContext.colors.secondaryText,
            opacity: disabled ? 0.5 : 1,
          },
        ]}
      >
        <Ionicons
          name="md-refresh"
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
