import { MaterialIcons } from "@expo/vector-icons";
import { useContext } from "react";
import { StyleSheet } from "react-native";
import { ThemeContext } from "../../../../theme/theme";

export const ActionButton = (props: { iconName: any; onPress: Function }) => {
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
      backgroundColor={themeFromContext.colors.primary}
      iconStyle={styles.operationIcon}
    ></MaterialIcons.Button>
  );
};

const styles = StyleSheet.create({
  operationIcon: {
    marginRight: 0,
  },
});
