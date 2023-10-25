import { ActivityIndicator, StyleSheet, View } from "react-native";
import { palette } from "../../theme/theme";

export const Loading = (props: { visible: boolean }) => {
  return (
    props.visible && (
      <View style={styles.container}>
        <View style={styles.background} />
        <ActivityIndicator size="large" color={palette.darkgreen} />
      </View>
    )
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
    position: "absolute",
    zIndex: 9999,
  },
  background: {
    position: "absolute",
    backgroundColor: "#000",
    height: "100%",
    width: "100%",
    opacity: 0.4,
  },
});
