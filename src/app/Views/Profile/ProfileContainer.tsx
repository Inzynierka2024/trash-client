import { useContext } from "react";
import { View, Text } from "react-native";
import { ThemeContext } from "../../../theme/theme";
import Ionicons from 'react-native-ionicons';


export const ProfileContainer = () => {
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
      <Text>Profile View</Text>
    </View>
  );
};
