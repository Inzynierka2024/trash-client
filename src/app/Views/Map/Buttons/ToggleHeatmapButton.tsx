import { Pressable, View, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useContext } from "react";
import { palette, ThemeContext } from "../../../../theme/theme";
import { LinearGradient } from "expo-linear-gradient";

export const ToggleHeatmapButton = (props: {
  toggleHeatmap: Function;
  state: boolean;
}) => {
  const themeFromContext = useContext(ThemeContext);
  const textColor = themeFromContext.colors.primaryText;
  const secondaryText = themeFromContext.colors.secondaryText;
  const background = themeFromContext.colors.background;

  return (
    <View>
      <Pressable
        style={[styles.button]}
        onPress={() => {
          props.toggleHeatmap();
        }}
      >
        <LinearGradient
          colors={
            props.state
              ? [
                  "rgba(29,108,189,0)",
                  "rgb(96,166,206)",
                  "rgb(195,218,231)",
                  "rgb(227,196,178)",
                  "rgb(211,121,86)",
                  "rgb(171,12,31)",
                ]
              : [background, background]
          }
          style={[
            styles.gradient,
            {
              borderColor: secondaryText,
            },
          ]}
        >
          <MaterialIcons
            style={[{ color: textColor }]}
            name={"layers"}
            size={30}
          />
        </LinearGradient>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: "center",
    alignItems: "center",
  },
  gradient: {
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderStyle: "solid",
  },
});
