import { useContext } from "react";
import styles from "./style";
import { Alert, Image, Keyboard, KeyboardAvoidingView, Text, TextInput, TouchableWithoutFeedback, Pressable, View} from "react-native";
import { ThemeContext } from "../../../theme/theme";
import Ionicons from 'react-native-ionicons';

import { Button, SocialIcon } from "react-native-elements";
import * as Facebook from "expo-facebook";

const appId = "1047121222092614";

export const ProfileContainer = () => {
  const themeFromContext = useContext(ThemeContext);
  const onLoginPress = () => {};

  const onFbLoginPress = async () => {
    
    };

  return (
    <KeyboardAvoidingView style={styles.containerView} behavior="padding">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.loginScreenContainer}>
          <View style={styles.loginFormView}>
            <Text style={styles.logoText}>Litter App</Text>
            <TextInput placeholder="Username" style={styles.loginFormTextInput} />
            <TextInput placeholder="Password" style={styles.loginFormTextInput} secureTextEntry={true} />
            <Button buttonStyle={styles.loginButton} onPress={() => onLoginPress()} title="Login" />
            <Button containerStyle={styles.fbLoginButton} type='clear' onPress={() => onFbLoginPress()} title="Login With Facebook" />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

