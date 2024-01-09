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
import passwordIcon from '../../../../assets/profile/password.png';
import Toast from 'react-native-toast-message';
import { edit_user_data } from '../../Logic/API/edit_user_data';
import { Loading } from '../../Utils/Loading';

export const ProfileEditForm = () => {
    const [loading, setLoading] = useState(false);
    const { state } = useAuth();
    const themeFromContext = useContext(ThemeContext);
    const navigation = useNavigation();
    const [password, setPassword] = useState('');
    const [user, setUserData] = useState({
        email: '',
        username: '',
        password: '',
    });

    async function getUser() {
        console.log("token:: ", state.token);
        const result = await get_user_data(state.token);
        if (result.isOk) {
            const user = result["data"];
            return user;
        } else {
            console.error("Invalid user");
            return [];
        }
    }

    useEffect(() => {
        setLoading(true);
        async function fetchData() {
            if (state.token) {
                const tempUser = await getUser();
                setUserData({ ...tempUser });
            }
        }
        fetchData().then(()=>{setLoading(false);});
    }, [state.token]);


    const handleSave = async () => {
        if (password.length > 0) {
            user.password = password;
        }
        const updatedUser = { ...user };
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
            fontWeight: 'bold',
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
            fontWeight: 'bold',
        },
    });

    return (
        <ThemeContext.Provider value={themeFromContext}>
            <Loading visible={loading} />
            <View style={styles.container}>
                <Image source={ll_icon} style={styles.userIcon} />

                <View style={styles.element}>
                    <Image source={profileIcon} style={styles.icon} />
                    <TextInput
                        style={styles.textInput}
                        value={user.username}
                        onChangeText={(text) => setUserData({ ...user, username: text })}
                        placeholder="Username"
                        placeholderTextColor={themeFromContext.colors.secondaryText}
                    />
                </View>

                <View style={styles.element}>
                    <Image source={gmailIcon} style={styles.icon} />
                    <TextInput
                        style={styles.textInput}
                        value={user.email}
                        onChangeText={(text) => setUserData({ ...user, email: text })}
                        placeholder="Email"
                        keyboardType="email-address"
                        placeholderTextColor={themeFromContext.colors.secondaryText}
                    />
                </View>
                <View style={styles.element}>
                    <Image source={passwordIcon} style={styles.icon} />
                    <TextInput
                        style={styles.textInput}
                        value={password}
                        onChangeText={setPassword}
                        placeholder="Hasło"
                        secureTextEntry={true}
                        placeholderTextColor={themeFromContext.colors.secondaryText}
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
