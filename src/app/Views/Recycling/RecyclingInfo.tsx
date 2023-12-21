import {
  Animated,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useEffect, useState } from "react";
import { palette } from "../../../theme/theme";

export const RecyclingInfo = (props: {
  name: string;
  color: string;
  content: [string[], string[]] | string;
  height: number;
}) => {
  const [height] = useState(new Animated.Value(0));
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    Animated.timing(height, {
      toValue: expanded ? props.height : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [expanded, height]);

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
        onPress={() => {
          setExpanded(!expanded);
        }}
      >
        <Text style={[styles.title]}>{props.name}</Text>
      </TouchableOpacity>
      <Animated.View style={[{ height, backgroundColor: palette.darken }]}>
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
                Należy wyrzucać
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
                Nie należy wyrzucać
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
    height: 64,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 16,
  },
  content: {
    padding: 8,
  },
  columns: {
    flexDirection: "row",
  },
  column: {
    flex: 1,
    flexDirection: "column",
    gap: 8,
    alignItems: "center",
  },
  text: {
    alignItems: "center",
  },
});
