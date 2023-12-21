import React, { useContext, useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { Icon } from 'react-native-elements';
import { ThemeContext } from "../../../theme/theme";
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../Logic/AuthContext';
import get_user_data from '../../Logic/API/get_user_data';
import ll_icon from "../../../../assets/litter-looter/adaptive.png";
import gmailIcon from '../../../../assets/profile/gmail.png';
import locationIcon from '../../../../assets/profile/home.png';
import profileIcon from '../../../../assets/profile/profile.png';
import Toast from 'react-native-toast-message';
import { edit_user_data } from '../../Logic/API/edit_user_data';

export const ProfileEditForm = () => {
  const [street, setStreet] = useState('');
  const [postCode, setPostCode] = useState('');
  const [city, setCity] = useState('');

  const { state } = useAuth();
  const themeFromContext = useContext(ThemeContext);
  const navigation = useNavigation();

  const [user, setUserData] = useState({
    email: '',
    location: '',
    username: ''
  });

  async function getUser() {
    console.log("token:: ", state.token);
    const result = await get_user_data(state.token);
    if (result.isOk) {
      const user = result["data"];
      const locationParts = user.location.split(',');
      if (locationParts.length === 3) {
        setStreet(locationParts[0].trim());
        setPostCode(locationParts[1].trim());
        setCity(locationParts[2].trim());
      } else {
        setStreet('');
        setPostCode('');
        setCity('');
      }
      return user;
    }
    else {
      console.error("Invalid user");
      return [];
    }
  }

  useEffect(() => {
    async function fetchData() {
      if (state.token) {
        const tempUser = await getUser();
        setUserData(tempUser);
      }
    }
    fetchData();
  }, [state.token]);


  const handleSave = async () => {
    const updatedUser = {
      ...user,
      location: `${street}, ${postCode}, ${city}`
    };
    const result = await edit_user_data(updatedUser, state.token);
    if (result) {
      Toast.show({
        type: 'success',
        text1: 'Informacje o użytkowniku zostały pomyślnie zaktualizowane!'
      });
      setUserData(user);
      navigation.goBack();
    } else {
      Toast.show({
        type: 'error',
        text1: 'Aktualizacja informacji o użytkowniku nie powiodła się'
      });
    }
  };


  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      justifyContent: 'center',
      alignItems: 'center',
    },
    element: {
      flexDirection: 'row',
      padding: 10,
      margin: 2,
      alignItems: 'center',
    },
    textInput: {
      borderBottomWidth: 1,
      borderBottomColor: '#CCCCCC',
      flex: 1,
      marginLeft: 10,
      color: themeFromContext.colors.primaryText,
    },
    icon: {
      width: 48,
      height: 48,
      resizeMode: 'contain',
      marginLeft: 4,
    },
    userIcon: {
      width: 100,
      height: 100,
      borderRadius: 50,
      marginBottom: 20,
      backgroundColor: '#fff'
    },
    saveButton: {
      marginTop: 20,
      padding: 10,
      backgroundColor: themeFromContext.colors.green,
      borderRadius: 5,
    },
    buttonText: {
      color: 'white',
      textAlign: 'center',
    },
  });

  return (
    <ThemeContext.Provider value={themeFromContext}>
      <View style={styles.container}>
        <Image source={ll_icon} style={styles.userIcon} />

        <View style={styles.element}>
          <Image source={profileIcon} style={styles.icon} />
          <TextInput
            style={styles.textInput}
            value={user.username}
            onChangeText={(text) => setUserData({ ...user, username: text })}
            placeholder="Imię gracza (username)"
          />
        </View>

        <View style={styles.element}>
          <Image source={gmailIcon} style={styles.icon} />
          <TextInput
            style={styles.textInput}
            value={user.email}
            onChangeText={(text) => setUserData({ ...user, email: text })}
            placeholder="Adres pocztowy"
            keyboardType="email-address"
          />
        </View>

        <View style={styles.element}>
          <Image source={locationIcon} style={styles.icon} />
          <TextInput
            style={styles.textInput}
            value={street}
            onChangeText={setStreet}
            placeholder="Ulica"
          />
        </View>

        {/* Post-Code Input */}
        <View style={styles.element}>
          <Image source={locationIcon} style={styles.icon} />
          <TextInput
            style={styles.textInput}
            value={postCode}
            onChangeText={setPostCode}
            placeholder="Kod pocztowy"
          />
        </View>

        {/* City Input */}
        <View style={styles.element}>
          <Image source={locationIcon} style={styles.icon} />
          <TextInput
            style={styles.textInput}
            value={city}
            onChangeText={setCity}
            placeholder="Miasto"
          />
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.buttonText}>Zapisz zmiany</Text>
        </TouchableOpacity>
      </View>
    </ThemeContext.Provider>
  );
};

export default ProfileEditForm;
