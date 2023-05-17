import { MaterialIcons } from "@expo/vector-icons";
import { useContext } from "react";
import { StyleSheet, View } from "react-native";
import { ThemeContext } from "../../../theme/theme";

export const CameraButton = (props: {
  iconName: any;
  size: number;
  onPress: Function;
}) => {
  const themeFromContext = useContext(ThemeContext);

  return (
    <View
      style={{
        width: props.size + 16,
        height: props.size + 16,
        borderRadius: props.size,
      }}
    >
      <MaterialIcons.Button
        onPress={() => {
          props.onPress();
        }}
        name={props.iconName}
        size={props.size}
        borderRadius={props.size / 2}
        color={themeFromContext.colors.primaryText}
        backgroundColor={themeFromContext.colors.secondary}
        iconStyle={{
          marginRight: 0,
        }}
      ></MaterialIcons.Button>
    </View>
  );
};
