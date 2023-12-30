import {
  Animated,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useEffect, useState } from "react";
import { palette } from "../../../theme/theme";
import { FontAwesome } from "@expo/vector-icons";

export const RecyclingInfo = (props: {
  name: string;
  color: string;
  content: [string[], string[]] | string;
  active: boolean;
  setActive: Function;
  close: Function;
  height: number;
}) => {
  const [height] = useState(new Animated.Value(0));
  const [opacity] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.parallel([
      Animated.timing(height, {
        toValue: props.active ? props.height : 0,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(opacity, {
        toValue: props.active ? 1 : 0,
        duration: 150,
        useNativeDriver: false,
      }),
    ]).start();
  }, [props.active, height]);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: props.color,
        },
      ]}
    >
      <TouchableOpacity
        style={[styles.button]}
        activeOpacity={0.2}
        onPress={() => {
          if (props.active) props.close();
          else props.setActive();
        }}
      >
        <Text style={[styles.title]}>{props.name}</Text>
      </TouchableOpacity>
      <Animated.View
        style={[{ opacity, height, backgroundColor: palette.whiten }]}
      >
        {typeof props.content === "string" ? (
          <Text style={[styles.content]}>{props.content}</Text>
        ) : (
          <View style={[styles.columns, styles.content]}>
            <View style={[styles.column]}>
              <Text
                style={[
                  styles.text,
                  {
                    fontWeight: "bold",
                  },
                ]}
              >
                <FontAwesome name="check" size={24} color="black" />
              </Text>
              {props.content[0].map((item, idx) => (
                <Text key={idx} style={[styles.text]}>
                  {item}
                </Text>
              ))}
            </View>
            <View style={[styles.column]}>
              <Text
                style={[
                  styles.text,
                  {
                    fontWeight: "bold",
                  },
                ]}
              >
                <FontAwesome name="times" size={24} color="black" />
              </Text>
              {props.content[1].map((item, idx) => (
                <Text key={idx} style={[styles.text]}>
                  {item}
                </Text>
              ))}
            </View>
          </View>
        )}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  title: {
    fontSize: 16,
    fontWeight: "500",
  },
  button: {
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 16,
    backgroundColor: palette.whiten,
  },
  content: {
    padding: 8,
  },
  columns: {
    flexDirection: "row",
    gap: 8,
  },
  column: {
    flex: 1,
    flexDirection: "column",
    gap: 8,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: palette.darken,
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  text: {
    alignItems: "center",
  },
});
