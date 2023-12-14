import React, { useContext, useEffect, useState, useCallback, useRef } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ToastAndroid, useColorScheme, Platform, Dimensions } from 'react-native';
import { TabView, TabBar } from 'react-native-tab-view';
import Animated from 'react-native-reanimated';
import { Icon } from 'react-native-elements'
import { ThemeContext, darkTheme, palette, theme } from "../../../theme/theme";
import { useNavigation } from '@react-navigation/native';
import get_api_url from '../../Utils/get_api_url';
import _fetch from '../../Logic/API/_fetch';
import { useAuth } from '../../Logic/AuthContext';
import get_user_data from '../../Logic/API/get_user_data';
import ll_icon from "../../../../assets/litter-looter/adaptive.png";
import { StickyTabView } from './StickyTabView';
import { FontAwesome5 } from '@expo/vector-icons';
import gmailIcon from '../../../../assets/profile/gmail.png';
import locationIcon from '../../../../assets/profile/home.png';
import passwordIcon from '../../../../assets/profile/password.png';
import profileIcon from '../../../../assets/profile/profile.png';
import pointsIcon from '../../../../assets/profile/coin.png';
import { FontAwesome } from '@expo/vector-icons'; // Import FontAwesome from Expo

const initialLayout = { width: Dimensions.get('window').width };

const CollectedTrashTab = () => (
  <View style={[styles.tabScene, { backgroundColor: '#ff4081' }]}>
    {/* Content for Collected Trash */}
  </View>
);

const ReportedTrashTab = () => (
  <View style={[styles.tabScene, { backgroundColor: '#673ab7' }]}>
    {/* Content for Reported Trash */}
  </View>
);

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
            const user = result["data"];
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

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            padding: 16,
            justifyContent: 'center',
            alignItems: 'center',
            //backgroundColor: '#F5F5F5',
        },
        emailContainer: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        emailText: {
            marginLeft: 10,
        },
        element: {
            flexDirection: 'row',
            padding: 10,
            margin: 2,
            alignItems: 'center', // Center items vertically
        },
        textCentered: {
            alignSelf: 'center', // Center the text vertically within its parent
            color: themeFromContext.colors.primaryText
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
            fontSize: 20,
            marginVertical: 8,
            width: '100%',
            textAlign: 'left',
            borderBottomWidth: 1,
            borderBottomColor: '#CCCCCC',
            paddingBottom: 4,
            fontWeight: 'normal',
            marginLeft: 10,
            color: themeFromContext.colors.primaryText
        },
        userIcon: {
            width: 100,
            height: 100,
            borderRadius: 50,
            marginBottom: 20,
            backgroundColor: '#fff'
        },
        icon: {
            width: 48,
            height: 48,
            resizeMode: 'contain', // Adjusts the image to fit within the specified dimensions
            marginLeft: 4,
        },


    });

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

                <View style={styles.element}>
                    <Image source={profileIcon} style={styles.icon} />
                    <Text style={[styles.readOnly, styles.textCentered]}> {user.username}</Text>
                </View>

                <View style={styles.element}>
                    <Image source={gmailIcon} style={styles.icon} resizeMode="contain" />
                    <Text style={styles.readOnly}> {user.email}</Text>
                </View>

                <View style={styles.element}>
                    <Image source={passwordIcon} style={styles.icon} />
                    <Text style={styles.readOnly}>***</Text>
                </View>


                <View style={styles.element}>
                    <Image source={locationIcon} style={styles.icon} />
                    <Text style={styles.readOnly}></Text>
                </View>

                <View style={styles.element}>
                    <Image source={pointsIcon} style={styles.icon} />
                    <Text style={styles.readOnly}></Text>
                </View>


                {/* <StickyTabView/> */}

            </View>
        </ThemeContext.Provider >
    );



};
export default ProfileStatsForm;
