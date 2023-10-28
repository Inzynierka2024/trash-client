import { MaterialIcons } from "@expo/vector-icons";
import { useContext } from "react";
import { View } from "react-native";
import { ThemeContext } from "../../../theme/theme";

export const CameraButton = (props: {
  iconName: any;
  size: number;
  backgroundColor: string;
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
        backgroundColor={props.backgroundColor}
        iconStyle={{
          marginRight: 0,
        }}
      ></MaterialIcons.Button>
    </View>
  );
};
