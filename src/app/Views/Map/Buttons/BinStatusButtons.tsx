import { BinStatus, BinStatusNames } from "../../../Models/BinStatus";
import { Text, StyleSheet, View, TouchableOpacity } from "react-native";
import { useContext } from "react";
import { ThemeContext } from "../../../../theme/theme";

export const BinStatusButtons = (props: {
  status: BinStatus;
  setStatus: Function;
}) => {
  const themeFromContext = useContext(ThemeContext);
  const textColor = themeFromContext.colors.primaryText;
  const backgroundColor = themeFromContext.colors.background;

  return (
    <View style={[styles.container]}>
      <View
        style={[
          styles.buttonSet,
          {
            borderColor: textColor,
          },
        ]}
      >
        <TouchableOpacity
          style={[
            styles.button,
            {
              backgroundColor:
                props.status === "empty" ? textColor : backgroundColor,
            },
          ]}
          onPress={() => props.setStatus("empty")}
        >
          <Text
            style={{
              color: props.status === "empty" ? backgroundColor : textColor,
            }}
            numberOfLines={1}
          >
            {BinStatusNames.empty}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button,
            {
              backgroundColor:
                props.status === "medium" ? textColor : backgroundColor,
            },
          ]}
          onPress={() => props.setStatus("medium")}
        >
          <Text
            style={{
              color: props.status === "medium" ? backgroundColor : textColor,
            }}
            numberOfLines={1}
          >
            {BinStatusNames.medium}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button,
            {
              backgroundColor:
                props.status === "full" ? textColor : backgroundColor,
            },
          ]}
          onPress={() => props.setStatus("full")}
        >
          <Text
            style={{
              color: props.status === "full" ? backgroundColor : textColor,
            }}
            numberOfLines={1}
          >
            {BinStatusNames.full}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button,
            {
              backgroundColor:
                props.status === "overfilled" ? textColor : backgroundColor,
            },
          ]}
          onPress={() => props.setStatus("overfilled")}
        >
          <Text
            style={{
              color:
                props.status === "overfilled" ? backgroundColor : textColor,
            }}
            numberOfLines={1}
          >
            {BinStatusNames.overfilled}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  buttonSet: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderRadius: 8,
    borderWidth: 2,
    flexWrap: "nowrap",
  },
  button: {
    padding: 8,
    borderRadius: 6,
  },
});
