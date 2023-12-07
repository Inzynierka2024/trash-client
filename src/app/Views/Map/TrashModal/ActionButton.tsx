import { MaterialIcons } from "@expo/vector-icons";
import React, { useContext } from "react";
import { StyleSheet, View } from "react-native";
import { ThemeContext } from "../../../../theme/theme";

export const ActionButton = (props: {
  iconName: any;
  onPress: Function;
  disabled: boolean;
  width: number;
}) => {
  const themeFromContext = useContext(ThemeContext);

  return (
    <View
      style={{
        width: props.width,
      }}
    >
      <MaterialIcons.Button
        onPress={() => {
          props.onPress();
        }}
        name={props.iconName}
        size={28}
        borderRadius={8}
        color={themeFromContext.colors.primaryText}
        style={{
          width: "100%",
          opacity: props.disabled ? 0.5 : 1,
          justifyContent: "center",
        }}
        backgroundColor={
          props.disabled
            ? themeFromContext.colors.disabled
            : themeFromContext.colors.primary
        }
        iconStyle={{
          marginRight: 0,
        }}
        disabled={props.disabled}
      ></MaterialIcons.Button>
    </View>
  );
};
