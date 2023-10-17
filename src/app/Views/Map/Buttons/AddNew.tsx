import { useContext, useState, useRef } from "react";
import {
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  View,
  Image,
  Text,
} from "react-native";
import { ThemeContext, palette } from "../../../../theme/theme";
import { FontAwesome } from "@expo/vector-icons";
import AnimatedPressable from "../../../Animated/AnimatedPressable";
import bagIcon from "../../../../../assets/icons/bags.png";
import canIcon from "../../../../../assets/icons/can.png";

export const AddNewButton = (props: {
  newTrash: Function;
  newCan: Function;
}) => {
  const themeFromContext = useContext(ThemeContext);

  const [open, setOpen] = useState(false);
  const [subMenu, setSubMenu] = useState("");

  const openRadius = 8;
  const iconSize = 32;

  const flySpeed = 200;
  const radiusSpeed = 200;

  const distance = 66;

  // Menu button open animations
  const radiusAnim = useRef(new Animated.Value(iconSize)).current;
  const canAnim = useRef(new Animated.Value(0)).current;
  const garbageAnim = useRef(new Animated.Value(0)).current;

  const garbageRadiusAnim = useRef(new Animated.Value(iconSize)).current;

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

  const openSizeMenu = () => {
    Animated.parallel([
      Animated.timing(garbageRadiusAnim, {
        toValue: openRadius,
        delay: 0,
        duration: radiusSpeed,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const closeSizeMenu = () => {
    Animated.parallel([
      Animated.timing(garbageRadiusAnim, {
        toValue: iconSize,
        delay: 0,
        duration: radiusSpeed,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <View>
      {subMenu === "new-trash" && (
        <View style={styles.container}>
          <AnimatedPressable
            style={[
              styles.button,
              styles.menu,
              {
                backgroundColor: palette.cyan,
                borderRadius: iconSize,
                right: distance,
                bottom: 3 * distance,
              },
            ]}
            onPress={() => {
              props.newTrash("l");
              setOpen(false);
              setSubMenu("");
              menuClose();
              closeSizeMenu();
            }}
          >
            <Text style={styles.textIcon}>L</Text>
          </AnimatedPressable>
          <AnimatedPressable
            style={[
              styles.button,
              styles.menu,
              {
                backgroundColor: palette.cyan,
                borderRadius: iconSize,
                right: distance,
                bottom: 2 * distance,
              },
            ]}
            onPress={() => {
              props.newTrash("m");
              setOpen(false);
              setSubMenu("");
              menuClose();
              closeSizeMenu();
            }}
          >
            <Text style={styles.textIcon}>M</Text>
          </AnimatedPressable>
          <AnimatedPressable
            style={[
              styles.button,
              styles.menu,
              {
                backgroundColor: palette.cyan,
                borderRadius: iconSize,
                right: distance,
                bottom: distance,
              },
            ]}
            onPress={() => {
              props.newTrash("s");
              setOpen(false);
              setSubMenu("");
              menuClose();
              closeSizeMenu();
            }}
          >
            <Text style={styles.textIcon}>S</Text>
          </AnimatedPressable>
        </View>
      )}
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
            menuClose();
          }}
        >
          <Image source={canIcon} style={styles.imageIcon} />
        </AnimatedPressable>

        <AnimatedPressable
          style={[
            styles.button,
            styles.trash,
            {
              borderRadius: garbageRadiusAnim,
              transform: [{ translateY: garbageAnim }],
            },
          ]}
          onPress={() => {
            if (subMenu !== "new-trash") {
              setSubMenu("new-trash");
              openSizeMenu();
            } else {
              setSubMenu("");
              closeSizeMenu();
            }
          }}
        >
          <Image source={bagIcon} style={styles.imageIcon} />
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
            setSubMenu("");

            setOpen(toOpen);
            if (toOpen) {
              menuOpen();
              closeSizeMenu();
            } else {
              menuClose();
              closeSizeMenu();
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
    width: 50,
    height: 50,
    position: "absolute",
    right: 0,
    bottom: 0,
  },
  textIcon: {
    color: palette.white,
    fontSize: 35,
    margin: 0,
    padding: 0,
    lineHeight: 38,
  },
  icon: {
    marginRight: 0,
    color: palette.white,
  },
  imageIcon: {
    height: 32,
    width: 32,
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
