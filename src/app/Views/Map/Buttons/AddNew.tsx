import { useContext, useState, useRef } from "react";
import { Animated, Easing, Pressable, StyleSheet, View } from "react-native";
import { ThemeContext, palette } from "../../../../theme/theme";
import { FontAwesome } from "@expo/vector-icons";
import AnimatedPressable from "../../../Animated/AnimatedPressable";

export const AddNewButton = (props: {
  newTrash: Function;
  newCan: Function;
}) => {
  const themeFromContext = useContext(ThemeContext);

  const [open, setOpen] = useState(false);

  const openRadius = 8;
  const iconSize = 40;

  // Menu button open animations
  const radiusAnim = useRef(new Animated.Value(iconSize)).current;
  const canAnim = useRef(new Animated.Value(0)).current;
  const garbageAnim = useRef(new Animated.Value(0)).current;

  const menuOpen = () => {
    Animated.timing(radiusAnim, {
      toValue: openRadius,
      delay: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();

    Animated.timing(canAnim, {
      toValue: -132,
      delay: 0,
      easing: Easing.sin,
      duration: 200,
      useNativeDriver: true,
    }).start();

    Animated.timing(garbageAnim, {
      toValue: -66,
      delay: 0,
      easing: Easing.sin,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const menuClose = () => {
    Animated.timing(radiusAnim, {
      toValue: iconSize,
      delay: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();

    Animated.timing(canAnim, {
      toValue: 0,
      delay: 0,
      easing: Easing.sin,
      duration: 200,
      useNativeDriver: true,
    }).start();

    Animated.timing(garbageAnim, {
      toValue: 0,
      delay: 0,
      easing: Easing.sin,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={styles.container}>
      <AnimatedPressable
        style={[
          styles.button,
          styles.garbagecan,
          {
            borderRadius: iconSize,
            transform: [{ translateY: canAnim }],
          },
        ]}
        onPress={() => {
          props.newTrash();
          setOpen(false);
        }}
      >
        <FontAwesome name="recycle" size={iconSize} style={styles.icon} />
      </AnimatedPressable>

      <AnimatedPressable
        style={[
          styles.button,
          styles.trash,
          {
            borderRadius: iconSize,
            transform: [{ translateY: garbageAnim }],
          },
        ]}
        onPress={() => {
          props.newTrash();
          setOpen(false);
        }}
      >
        <FontAwesome name="trash" size={iconSize} style={styles.icon} />
      </AnimatedPressable>

      <AnimatedPressable
        style={[
          styles.button,
          styles.menu,
          {
            borderRadius: radiusAnim,
          },
        ]}
        onPress={() => {
          const toOpen = !open;

          setOpen(toOpen);
          if (toOpen) menuOpen();
          else menuClose();
        }}
      >
        <FontAwesome name="plus" size={iconSize} style={styles.icon} />
      </AnimatedPressable>
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
    width: 58,
    position: "absolute",
    right: 0,
    bottom: 0,
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
