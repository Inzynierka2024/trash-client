import { Pressable, StyleSheet, View } from "react-native";

export const ShutterButton = (props: { onPress: Function }) => {
  return (
    <View>
      <Pressable
        style={styles.button}
        onPress={() => {
          props.onPress();
        }}
      ></Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#eee",
    borderColor: "#aaa",
    borderWidth: 4,
  },
});
