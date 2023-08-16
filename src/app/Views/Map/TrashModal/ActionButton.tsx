import { MaterialIcons } from "@expo/vector-icons";
import { useContext } from "react";
import { StyleSheet } from "react-native";
import { ThemeContext } from "../../../../theme/theme";

export const ActionButton = (props: {
  iconName: any;
  onPress: Function;
  disabled: boolean;
}) => {
  const themeFromContext = useContext(ThemeContext);

  return (
    <MaterialIcons.Button
      onPress={() => {
        props.onPress();
      }}
      name={props.iconName}
      size={28}
      borderRadius={8}
      color={themeFromContext.colors.primaryText}
      style={{
        opacity: props.disabled ? 0.5 : 1,
      }}
      backgroundColor={
        props.disabled
          ? themeFromContext.colors.disabled
          : themeFromContext.colors.primary
      }
      iconStyle={styles.operationIcon}
      disabled={props.disabled}
    ></MaterialIcons.Button>
  );
};

const styles = StyleSheet.create({
  operationIcon: {
    marginRight: 0,
  },
});
