import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ToastAndroid, useColorScheme } from 'react-native';
import { Icon } from 'react-native-elements'
import { ThemeContext, darkTheme, palette, theme } from "../../../theme/theme";
import { useNavigation } from '@react-navigation/native';
import get_api_url from '../../Utils/get_api_url';
import _fetch from '../../Logic/API/_fetch';
import { useAuth } from '../../Logic/AuthContext';
import get_user_data from '../../Logic/API/get_user_data';


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
            console.log("tempUser", tempUser);
            setUserData(tempUser);
            console.log("user", user);
        }
    }, [state.token]);

    return (
        <ThemeContext.Provider value={darkMode ? darkTheme : theme}>
            <View style={styles.container}>
                <TouchableOpacity style={styles.editIcon} onPress={navigateToEditForm}>
                    <Icon name='edit' size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.readOnly}>Username: {user.username}</Text>
                <Text style={styles.readOnly}>Email: {user['email']}</Text>
                {/* <Text style={styles.readOnly}>Location: {userData.location.city}, {userData.location.country}</Text> */}
                {/* <Text style={styles.readOnly}>Gathered Trash: {userData.stats.gatheredTrash}</Text>
        <Text style={styles.readOnly}>Reported Trash: {userData.stats.reportedTrash}</Text>
        <Text style={styles.readOnly}>Points: {userData.stats.points}</Text> */}
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
    },

});

export default ProfileStatsForm;
