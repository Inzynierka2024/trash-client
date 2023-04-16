import { useContext } from "react";
import { View, Text } from "react-native";
import { ThemeContext } from "../../../theme/theme";

export const RankingContainer = () => {
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
      <Text>Ranking View</Text>
    </View>
  );
};
