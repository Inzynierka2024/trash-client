import { useContext } from "react";
import { View, Text, Button } from "react-native";
import { ThemeContext } from "../../../theme/theme";

export const NoPermissionScreen = (props: { checkPermissions }) => {
  const themeFromContext = useContext(ThemeContext);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: themeFromContext.colors.background,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text style={{ color: themeFromContext.colors.primaryText }}>
        You need to accept location permissions in order to use this application
      </Text>

      <Button
        onPress={() => {
          props.checkPermissions();
        }}
        title="Grant permissions"
      ></Button>
    </View>
  );
};
