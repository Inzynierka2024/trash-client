import { useContext } from "react";
import { View, Text, TextInput } from "react-native";
import { OptionsContext } from "../../Logic/StateProvider";

export const DebugOptions = (props: { setApi: (text: string) => void }) => {
  const { API_URL } = useContext(OptionsContext);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "lightgray",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text>Internal settings</Text>
      <TextInput
        inputMode="url"
        placeholder="API Url"
        style={{
          height: 40,
          width: 200,
          borderColor: "#000a",
          borderWidth: 2,
          padding: 10,
          margin: 12,
        }}
        value={API_URL}
        onChangeText={props.setApi}
      ></TextInput>
    </View>
  );
};
