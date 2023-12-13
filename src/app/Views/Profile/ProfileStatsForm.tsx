import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ToastAndroid, useColorScheme } from 'react-native';
import { Icon } from 'react-native-elements'
import { ThemeContext, darkTheme, palette, theme } from "../../../theme/theme";
import { useNavigation } from '@react-navigation/native';
import get_api_url from '../../Utils/get_api_url';
import _fetch from '../../Logic/API/_fetch';
import { useAuth } from '../../Logic/AuthContext';
import get_user_data from '../../Logic/API/get_user_data';
import ll_icon from "../../../../assets/litter-looter/adaptive.png";


export const ProfileStatsForm = () => {

    const { state } = useAuth();
    const [user, setUserData] = useState(
        {
            email: '',
            location: '',
            username: ''
        });

    const [darkMode, _setDarkMode] = useState(
        useColorScheme() === "dark" ? true : false
    );
    const themeFromContext = useContext(ThemeContext);
    const navigation = useNavigation();

    const navigateToEditForm = () => {
        navigation.navigate('ProfileEdit');
    };

    async function getUser() {
        const result = await get_user_data(state.token);
        if (result.isOk) {
            console.log(result);
            const user = result["data"];
            console.log("u>", user);
            return user;
        } else {
            console.error("Invalid user");
            return [];
        }
    }

    useEffect(async () => {
        if (state.token) {
            const tempUser = await getUser();
            setUserData(tempUser);
        }
    }, [state.token]);

    return (
        <ThemeContext.Provider value={darkMode ? darkTheme : theme}>
            <View style={styles.container}>
                <TouchableOpacity style={styles.editIcon} onPress={navigateToEditForm}>
                    <Icon name='edit' size={24} color="#000" />
                </TouchableOpacity>
                <Image
                    source={ll_icon}
                    style={styles.userIcon}
                />
                <Text style={styles.readOnlyBold}> Login:
                    <Text style={styles.readOnly}> {user.username}</Text>
                </Text>
                <Text style={styles.readOnlyBold}>Email:
                    <Text style={styles.readOnly}> {user.email}</Text>
                </Text>
                <Text style={styles.readOnlyBold}>Hasło:
                    <Text style={styles.readOnly}>***</Text>
                </Text>
                <Text style={styles.readOnlyBold}>Lokacja:
                    <Text style={styles.readOnly}></Text>
                </Text>
                <Text style={styles.readOnlyBold}>Zebrane odpady:
                    <Text style={styles.readOnly}></Text>
                </Text>
                <Text style={styles.readOnlyBold}>Zgłoszone odpady:
                    <Text style={styles.readOnly}></Text>
                </Text>
                <Text style={styles.readOnlyBold}>Punkty:
                    <Text style={styles.readOnly}></Text>
                </Text>
            </View>
        </ThemeContext.Provider>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        justifyContent: 'center',
        alignItems: 'center',
        //backgroundColor: '#F5F5F5',
    },
    editIcon: {
        position: 'absolute',
        marginTop: 25,
        top: 16,
        right: 16,
        zIndex: 10,
        padding: 8,
        backgroundColor: '#dcf',
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3,
    },
    readOnly: {
        fontSize: 16,
        marginVertical: 8,
        //color: '#ccc',
        width: '100%',
        textAlign: 'left',
        borderBottomWidth: 1,
        borderBottomColor: '#CCCCCC',
        paddingBottom: 4,
        fontWeight: 'normal'
    },
    readOnlyBold: {
        fontSize: 16,
        marginVertical: 8,
        //color: '#ccc',
        width: '100%',
        textAlign: 'left',
        borderBottomWidth: 1,
        borderBottomColor: '#CCCCCC',
        paddingBottom: 4,
        fontWeight: 'bold'
    },
    userIcon: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 20,
        backgroundColor: '#fff'
    },

});

export default ProfileStatsForm;
