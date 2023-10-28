import { useContext, useState, useRef } from "react";
import { Animated, Easing, Text, StyleSheet, View, Image } from "react-native";
import { ThemeContext, palette } from "../../../../theme/theme";
import { FontAwesome } from "@expo/vector-icons";
import AnimatedPressable from "../../../Animated/AnimatedPressable";
import { ElementIcons } from "../../../Models/ElementIcons";
import { ElementNames } from "../../../Models/ElementNames";

export const AddNewButton = (props: {
  newTrash: Function;
  newCan: Function;
}) => {
  const themeFromContext = useContext(ThemeContext);

  const [open, setOpen] = useState(false);
  const [containerOpen, setContainerOpen] = useState(false);

  const openRadius = 8;
  const iconSize = 32;

  const flySpeed = 200;
  const radiusSpeed = 200;

  const distance = 66;

  // Menu button open animations
  const radiusAnim = useRef(new Animated.Value(iconSize)).current;
  const canAnim = useRef(new Animated.Value(0)).current;
  const garbageAnim = useRef(new Animated.Value(0)).current;

  const menuOpen = () => {
    Animated.parallel([
      Animated.timing(radiusAnim, {
        toValue: openRadius,
        delay: 0,
        duration: radiusSpeed,
        useNativeDriver: true,
      }),

      Animated.timing(canAnim, {
        toValue: -(distance * 2),
        delay: 0,
        easing: Easing.quad,
        duration: flySpeed,
        useNativeDriver: true,
      }),

      Animated.timing(garbageAnim, {
        toValue: -distance,
        delay: 0,
        easing: Easing.quad,
        duration: flySpeed,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const menuClose = () => {
    Animated.parallel([
      Animated.timing(radiusAnim, {
        toValue: iconSize,
        delay: 0,
        duration: radiusSpeed,
        useNativeDriver: true,
      }),

      Animated.timing(canAnim, {
        toValue: 0,
        delay: 0,
        easing: Easing.quad,
        duration: flySpeed,
        useNativeDriver: true,
      }),

      Animated.timing(garbageAnim, {
        toValue: 0,
        delay: 0,
        easing: Easing.quad,
        duration: flySpeed,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <View style={styles.container}>
      {containerOpen === true && (
        <View style={[styles.container, styles.canContainer]}>
          <View style={styles.labelContainer}>
            <Text
              style={[
                styles.label,
                { color: themeFromContext.colors.primaryText },
              ]}
            >
              {ElementNames.cloth}
            </Text>

            <Text
              style={[
                styles.label,
                { color: themeFromContext.colors.primaryText },
              ]}
            >
              {ElementNames.debris}
            </Text>

            <Text
              style={[
                styles.label,
                { color: themeFromContext.colors.primaryText },
              ]}
            >
              {ElementNames.pszok}
            </Text>

            <Text
              style={[
                styles.label,
                { color: themeFromContext.colors.primaryText },
              ]}
            >
              {ElementNames["e-waste"]}
            </Text>

            <Text
              style={[
                styles.label,
                { color: themeFromContext.colors.primaryText },
              ]}
            >
              {ElementNames.general}
            </Text>
          </View>
          <AnimatedPressable
            style={[
              styles.button,
              styles.canButton,
              styles.cloth,
              {
                borderRadius: iconSize,
              },
            ]}
            onPress={() => {
              console.log("press");
            }}
          >
            <Image source={ElementIcons.cloth} style={styles.imageIcon} />
          </AnimatedPressable>

          <AnimatedPressable
            style={[
              styles.button,
              styles.canButton,
              styles.debris,
              {
                borderRadius: iconSize,
              },
            ]}
            onPress={() => {
              console.log("press");
            }}
          >
            <Image source={ElementIcons.debris} style={styles.imageIcon} />
          </AnimatedPressable>

          <AnimatedPressable
            style={[
              styles.button,
              styles.canButton,
              styles.pszok,
              {
                borderRadius: iconSize,
              },
            ]}
            onPress={() => {
              console.log("press");
            }}
          >
            <Image source={ElementIcons.pszok} style={styles.imageIcon} />
          </AnimatedPressable>

          <AnimatedPressable
            style={[
              styles.button,
              styles.canButton,
              styles.ewaste,
              {
                borderRadius: iconSize,
              },
            ]}
            onPress={() => {
              console.log("press");
            }}
          >
            <Image source={ElementIcons["e-waste"]} style={styles.imageIcon} />
          </AnimatedPressable>

          <AnimatedPressable
            style={[
              styles.button,
              styles.canButton,
              styles.general,
              {
                borderRadius: iconSize,
              },
            ]}
            onPress={() => {
              console.log("press");
            }}
          >
            <Image source={ElementIcons.general} style={styles.imageIcon} />
          </AnimatedPressable>
        </View>
      )}
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
          setContainerOpen(!containerOpen);
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
          menuClose();
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
          else {
            menuClose();
            setContainerOpen(false);
          }
        }}
      >
        <FontAwesome
          name={open ? "close" : "plus"}
          size={iconSize}
          style={[
            styles.icon,
            {
              bottom: open ? 3 : 0,
            },
          ]}
        />
      </AnimatedPressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    gap: 12,
  },
  canContainer: {
    marginBottom: 58,
  },
  button: {
    padding: 8,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 10,
    width: 50,
    position: "absolute",
    right: 0,
    bottom: 0,
  },
  canButton: {
    right: 64,
    position: "relative",
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
  cloth: {
    backgroundColor: palette.darkgreen,
  },
  debris: {
    backgroundColor: palette.blacklighter,
  },
  pszok: {
    backgroundColor: palette.blacklighter,
  },
  ewaste: {
    backgroundColor: palette.darkblue,
  },
  general: {
    backgroundColor: palette.darkgreen,
  },
  imageIcon: {
    height: 32,
    width: 32,
  },
  labelContainer: {
    position: "absolute",
    flexDirection: "column",
    right: 124,
    paddingTop: 14,
    gap: 46,
    width: 120,
  },
  label: {
    textAlign: "right",
  },
});
