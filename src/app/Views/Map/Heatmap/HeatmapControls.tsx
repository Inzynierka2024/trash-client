import { Pressable, View, StyleSheet, Text } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useContext } from "react";
import { palette, ThemeContext } from "../../../../theme/theme";
import Modal from "react-native-modal";

export const HeatmapControls = (props: {
  moveHeatmapPeriod: Function;
  currentHeatmapPeriod: [Date, Date] | null;
}) => {
  const themeFromContext = useContext(ThemeContext);
  const textColor = themeFromContext.colors.primaryText;
  const backgroundColor = themeFromContext.colors.background;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor,
        },
      ]}
    >
      <Pressable
        style={[styles.button]}
        onPress={() => {
          props.moveHeatmapPeriod(-1);
        }}
      >
        <MaterialIcons
          style={[{ color: textColor }]}
          name={"arrow-left"}
          size={30}
        />
      </Pressable>

      <View style={styles.textContainer}>
        <Text
          style={[
            styles.dateText,
            {
              color: textColor,
            },
          ]}
        >
          {props.currentHeatmapPeriod &&
            props.currentHeatmapPeriod[0].toLocaleDateString("pl-PL", {
              year: "numeric",
              month: "long",
            })}
        </Text>
      </View>

      <Pressable
        style={[styles.button]}
        onPress={() => {
          props.moveHeatmapPeriod(1);
        }}
      >
        <MaterialIcons
          style={[{ color: textColor }]}
          name={"arrow-right"}
          size={30}
        />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    width: 192,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: palette.darkgreen,
  },
  textContainer: {
    width: 128,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    width: 32,
    height: "100%",
    backgroundColor: palette.whiten,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  dateText: {},
});
