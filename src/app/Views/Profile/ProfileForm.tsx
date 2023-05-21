import { useContext } from "react";
import styles from "./style";
import { Alert, Image, Keyboard, KeyboardAvoidingView, Text, TextInput, TouchableWithoutFeedback, Pressable, View} from "react-native";
import { ThemeContext } from "../../../theme/theme";
import Ionicons from 'react-native-ionicons';

import { Button, SocialIcon } from "react-native-elements";


const appId = "1047121222092614";

export const ProfileForm = () => {

  const themeFromContext = useContext(ThemeContext);

  return (
    <KeyboardAvoidingView style={styles.containerView} behavior="padding">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.loginScreenContainer}>
          <View style={styles.loginFormView}>
            <Text style={styles.logoText}>Litter Looter</Text>
            <Text>Welcome!</Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};
export default ProfileForm;
