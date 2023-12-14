import { StyleSheet, Text, Animated, Pressable } from "react-native";
import { useContext, useRef } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { ThemeContext } from "../../../../theme/theme";
import { ElementTypes } from "../../../Models/ElementTypes";
import { ElementColors } from "../../../Models/ElementColors";

export const FilterButton = (props: {
  toggleState: Function;
  state: boolean;
  name: string;
  color: string;
  elementKey: ElementTypes;
}) => {
  const themeFromContext = useContext(ThemeContext);
  const textColor = themeFromContext.colors.primaryText;

  // Animation of background color
  const opacity = useRef(
    new Animated.Value(props.state === true ? 1 : 0),
  ).current;

  function toggleOnAnim() {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }

  function toggleOffAnim() {
    Animated.timing(opacity, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }

  function toggle() {
    if (props.state === true) {
      toggleOffAnim();
    } else {
      toggleOnAnim();
    }
    props.toggleState(props.elementKey);
  }

  return (
    <Pressable
      onPress={toggle}
      style={[
        styles.button,
        {
          backgroundColor: themeFromContext.colors.background,
        },
      ]}
    >
      <Animated.View
        style={[
          styles.colorOverlay,
          {
            backgroundColor: ElementColors[props.elementKey],
            opacity: opacity,
          },
        ]}
      ></Animated.View>
      <Text numberOfLines={1} style={[styles.text, { color: textColor }]}>
        {props.name}
      </Text>
      <MaterialIcons
        style={[
          styles.check,
          {
            color: textColor,
            display: props.state ? "flex" : "none",
          },
        ]}
        name="check"
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  colorOverlay: {
    position: "absolute",
    height: "100%",
    width: "100%",
  },
  button: {
    height: 42,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
    padding: 8,
  },
  check: {
    fontSize: 18,
    marginRight: 8,
  },
});
