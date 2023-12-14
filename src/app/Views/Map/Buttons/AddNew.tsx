import { useContext, useState, useRef } from "react";
import { Animated, Easing, Text, StyleSheet, View, Image } from "react-native";
import { ThemeContext, palette } from "../../../../theme/theme";
import { FontAwesome } from "@expo/vector-icons";
import AnimatedPressable from "../../../Animated/AnimatedPressable";
import { ElementIcons } from "../../../Models/ElementIcons";
import { ElementNames } from "../../../Models/ElementNames";
import { ElementColors } from "../../../Models/ElementColors";

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
          <View
            style={[
              styles.field,
              {
                backgroundColor: ElementColors.battery,
              },
            ]}
          >
            <Text
              style={[
                styles.label,
                { color: themeFromContext.colors.primaryText },
              ]}
            >
              {ElementNames.battery}
            </Text>

            <AnimatedPressable
              style={[
                styles.button,
                styles.canButton,
                {
                  borderRadius: iconSize,
                  backgroundColor: ElementColors.battery,
                },
              ]}
              onPress={() => {
                props.newCan("battery");
              }}
            >
              <Image source={ElementIcons.battery} style={styles.imageIcon} />
            </AnimatedPressable>
          </View>

          <View
            style={[
              styles.field,
              {
                backgroundColor: ElementColors.cloth,
              },
            ]}
          >
            <Text
              style={[
                styles.label,
                { color: themeFromContext.colors.primaryText },
              ]}
            >
              {ElementNames.cloth}
            </Text>

            <AnimatedPressable
              style={[
                styles.button,
                styles.canButton,
                {
                  borderRadius: iconSize,
                  backgroundColor: ElementColors.cloth,
                },
              ]}
              onPress={() => {
                props.newCan("cloth");
              }}
            >
              <Image source={ElementIcons.cloth} style={styles.imageIcon} />
            </AnimatedPressable>
          </View>

          <View
            style={[
              styles.field,
              {
                backgroundColor: ElementColors["e-waste"],
              },
            ]}
          >
            <Text
              style={[
                styles.label,
                { color: themeFromContext.colors.primaryText },
              ]}
            >
              {ElementNames["e-waste"]}
            </Text>

            <AnimatedPressable
              style={[
                styles.button,
                styles.canButton,
                {
                  borderRadius: iconSize,
                  backgroundColor: ElementColors["e-waste"],
                },
              ]}
              onPress={() => {
                props.newCan("e-waste");
              }}
            >
              <Image
                source={ElementIcons["e-waste"]}
                style={styles.imageIcon}
              />
            </AnimatedPressable>
          </View>

          <View
            style={[
              styles.field,
              {
                backgroundColor: ElementColors.bio,
              },
            ]}
          >
            <Text
              style={[
                styles.label,
                { color: themeFromContext.colors.primaryText },
              ]}
            >
              {ElementNames.bio}
            </Text>

            <AnimatedPressable
              style={[
                styles.button,
                styles.canButton,
                {
                  borderRadius: iconSize,
                  backgroundColor: ElementColors.bio,
                },
              ]}
              onPress={() => {
                props.newCan("bio");
              }}
            >
              <Image source={ElementIcons.bio} style={styles.imageIcon} />
            </AnimatedPressable>
          </View>

          <View
            style={[
              styles.field,
              {
                backgroundColor: ElementColors.glass,
              },
            ]}
          >
            <Text
              style={[
                styles.label,
                { color: themeFromContext.colors.primaryText },
              ]}
            >
              {ElementNames.glass}
            </Text>

            <AnimatedPressable
              style={[
                styles.button,
                styles.canButton,
                {
                  borderRadius: iconSize,
                  backgroundColor: ElementColors.glass,
                },
              ]}
              onPress={() => {
                props.newCan("glass");
              }}
            >
              <Image source={ElementIcons.glass} style={styles.imageIcon} />
            </AnimatedPressable>
          </View>

          <View
            style={[
              styles.field,
              {
                backgroundColor: ElementColors.paper,
              },
            ]}
          >
            <Text
              style={[
                styles.label,
                { color: themeFromContext.colors.primaryText },
              ]}
            >
              {ElementNames.paper}
            </Text>

            <AnimatedPressable
              style={[
                styles.button,
                styles.canButton,
                {
                  borderRadius: iconSize,
                  backgroundColor: ElementColors.paper,
                },
              ]}
              onPress={() => {
                props.newCan("paper");
              }}
            >
              <Image source={ElementIcons.paper} style={styles.imageIcon} />
            </AnimatedPressable>
          </View>

          <View
            style={[
              styles.field,
              {
                backgroundColor: ElementColors.plastic,
              },
            ]}
          >
            <Text
              style={[
                styles.label,
                { color: themeFromContext.colors.primaryText },
              ]}
            >
              {ElementNames.plastic}
            </Text>

            <AnimatedPressable
              style={[
                styles.button,
                styles.canButton,
                {
                  borderRadius: iconSize,
                  backgroundColor: ElementColors.plastic,
                },
              ]}
              onPress={() => {
                props.newCan("plastic");
              }}
            >
              <Image source={ElementIcons.plastic} style={styles.imageIcon} />
            </AnimatedPressable>
          </View>

          <View
            style={[
              styles.field,
              {
                backgroundColor: ElementColors.general,
              },
            ]}
          >
            <Text
              style={[
                styles.label,
                { color: themeFromContext.colors.primaryText },
              ]}
            >
              {ElementNames.general}
            </Text>

            <AnimatedPressable
              style={[
                styles.button,
                styles.canButton,
                {
                  borderRadius: iconSize,
                  backgroundColor: ElementColors.general,
                },
              ]}
              onPress={() => {
                props.newCan("general");
              }}
            >
              <Image source={ElementIcons.general} style={styles.imageIcon} />
            </AnimatedPressable>
          </View>
        </View>
      )}
      <AnimatedPressable
        style={[
          styles.button,
          {
            borderRadius: iconSize,
            transform: [{ translateY: canAnim }],
            backgroundColor: ElementColors.general,
          },
        ]}
        onPress={() => {
          setContainerOpen(!containerOpen);
        }}
      >
        <Image source={ElementIcons.recyclingBin} style={styles.imageIcon} />
      </AnimatedPressable>

      <AnimatedPressable
        style={[
          styles.button,
          {
            borderRadius: iconSize,
            transform: [{ translateY: garbageAnim }],
            backgroundColor: ElementColors.garbage,
          },
        ]}
        onPress={() => {
          props.newTrash();
          setOpen(false);
          setContainerOpen(false);
          menuClose();
        }}
      >
        <Image source={ElementIcons.garbage} style={styles.imageIcon} />
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
  },
  canContainer: {
    marginRight: 16,
    marginBottom: 54,
  },
  field: {
    flexDirection: "row",
    marginTop: 8,
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 8,
    marginRight: 48,
    borderRadius: 8,
    padding: 2,
    paddingLeft: 12,
  },
  button: {
    padding: 8,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 10,
    width: 50,
    height: 50,
    position: "absolute",
    right: 0,
    bottom: 0,
  },
  canButton: {
    position: "relative",
  },
  icon: {
    marginRight: 0,
    color: palette.white,
  },
  menu: {
    backgroundColor: palette.darkgreen,
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
