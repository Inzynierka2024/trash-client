import { useContext, useState, useRef } from "react";
import { Animated, StyleSheet, View, Image } from "react-native";
import { ThemeContext, palette } from "../../../../theme/theme";
import { FontAwesome } from "@expo/vector-icons";
import AnimatedPressable from "../../../Animated/AnimatedPressable";
import { ElementIcons } from "../../../Models/ElementIcons";
import { ElementNames } from "../../../Models/ElementNames";
import { ElementColors } from "../../../Models/ElementColors";
import { AddBinButton } from "./AddBinButton";
import Modal from "react-native-modal";

export const AddNewButton = (props: {
  newTrash: Function;
  newCan: Function;
}) => {
  const themeFromContext = useContext(ThemeContext);

  const [open, setOpen] = useState(false);
  const [containerOpen, setContainerOpen] = useState(false);

  const openRadius = 8;
  const iconSize = 32;

  const radiusSpeed = 200;

  // Menu button open animations
  const radiusAnim = useRef(new Animated.Value(iconSize)).current;

  const menuOpen = () => {
    Animated.parallel([
      Animated.timing(radiusAnim, {
        toValue: openRadius,
        delay: 0,
        duration: radiusSpeed,
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
    ]).start();
  };

  return (
    <View style={styles.container}>
      <Modal
        animationIn="fadeInUp"
        animationOut="fadeOutDown"
        isVisible={containerOpen}
        hideModalContentWhileAnimating
        statusBarTranslucent
        onBackButtonPress={() => {
          setContainerOpen(false);
        }}
        onBackdropPress={() => {
          setContainerOpen(false);
        }}
        backdropOpacity={0}
        style={[styles.fullScreenModal]}
      >
        <View style={[styles.binContainer]}>
          <AddBinButton
            type="battery"
            newBin={props.newCan}
            iconSize={iconSize}
          />

          <AddBinButton
            type="cloth"
            newBin={props.newCan}
            iconSize={iconSize}
          />

          <AddBinButton type="bio" newBin={props.newCan} iconSize={iconSize} />

          <AddBinButton
            type="glass"
            newBin={props.newCan}
            iconSize={iconSize}
          />

          <AddBinButton
            type="paper"
            newBin={props.newCan}
            iconSize={iconSize}
          />

          <AddBinButton
            type="plastic"
            newBin={props.newCan}
            iconSize={iconSize}
          />

          <AddBinButton
            type="general"
            newBin={props.newCan}
            iconSize={iconSize}
          />
        </View>
      </Modal>

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
        {open && (
          <FontAwesome
            name="close"
            size={iconSize}
            style={[
              styles.icon,
              {
                bottom: 3,
              },
            ]}
          />
        )}

        {!open && (
          <FontAwesome
            name="plus"
            size={iconSize}
            style={[
              styles.icon,
              {
                bottom: 0,
              },
            ]}
          />
        )}
      </AnimatedPressable>

      <Modal
        animationIn="fadeInUp"
        animationOut="fadeOutDown"
        hideModalContentWhileAnimating
        statusBarTranslucent
        isVisible={open}
        onBackButtonPress={() => {
          setOpen(false);
          menuClose();
        }}
        onBackdropPress={() => {
          setOpen(false);
          menuClose();
        }}
        backdropOpacity={0}
        style={[styles.fullScreenModal]}
      >
        <View style={[styles.menusContainer]}>
          <AnimatedPressable
            style={[
              styles.button,
              {
                borderRadius: iconSize,
                backgroundColor: ElementColors.general,
              },
            ]}
            onPress={() => {
              setContainerOpen(!containerOpen);
            }}
          >
            {containerOpen && (
              <FontAwesome
                name="close"
                size={iconSize}
                style={[
                  styles.icon,
                  {
                    bottom: open ? 3 : 0,
                  },
                ]}
              />
            )}
            {!containerOpen && (
              <Image
                source={ElementIcons.recyclingBin}
                style={styles.imageIcon}
              />
            )}
          </AnimatedPressable>

          <AnimatedPressable
            style={[
              styles.button,
              {
                borderRadius: iconSize,
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
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
  },
  binContainer: {
    flexDirection: "column",
    marginRight: 80,
    marginBottom: 128,
    width: 256,
  },
  button: {
    padding: 8,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 10,
    width: 50,
    height: 50,
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
  fullScreenModal: {
    margin: 0,
    padding: 0,
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
  menusContainer: {
    marginBottom: 134,
    marginRight: 16,
    gap: 12,
  },
});
