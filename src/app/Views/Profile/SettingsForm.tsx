import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Switch, Platform, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const THEME_KEY = 'app_theme';

type Theme = 'light' | 'dark' | 'system';

const SettingsForm: React.FC = () => {
    const [theme, setTheme] = useState < Theme > ('system');
    const [canSendMessage, setCanSendMessage] = useState(false);
    const [hasCameraAccess, setHasCameraAccess] = useState(false);

    useEffect(() => {
        AsyncStorage.getItem(THEME_KEY).then(storedTheme => {
            if (storedTheme) {
                setTheme(storedTheme as Theme);
            }
        });
    }, []);

    const handleThemeChange = (newTheme: Theme) => {
        AsyncStorage.setItem(THEME_KEY, newTheme);
        setTheme(newTheme);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Theme</Text>

            <View style={styles.buttonGroup}>
                {['Light', 'Dark', 'System'].map((item) => (
                    <TouchableOpacity
                        key={item}
                        style={[styles.button, theme.toLowerCase() === item.toLowerCase() && styles.activeButton]}
                        onPress={() => handleThemeChange(item.toLowerCase() as Theme)}
                    >
                        <Text style={[styles.buttonText, theme.toLowerCase() === item.toLowerCase() && styles.activeButtonText]}>{item}</Text>

                    </TouchableOpacity>
                ))}
            </View>

            <View style={styles.settingRow}>
                <Text style={styles.settingText}>Notifcations</Text>
                <Switch
                    thumbColor={'#fff'}
                    trackColor={{ false: "#767577", true: "#3d9970" }}
                    value={canSendMessage}
                    onValueChange={() => { /*TODO: handle permission here */ }}
                />
            </View>

            <View style={styles.settingRow}>
                <Text style={styles.settingText}>Camera Access</Text>
                <Switch
                    thumbColor={'#fff'}
                    trackColor={{ false: "#767577", true: "#3d9970" }}
                    value={hasCameraAccess}
                    onValueChange={() => { /*TODO: handle permission here */ }}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5'
    },
    header: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#3d9970'
    },
    buttonGroup: {
        flexDirection: 'row',
        marginBottom: 25
    },
    button: {
        flex: 1,
        padding: 15,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#3d9970',
        borderRadius: 5,
        marginHorizontal: 5
    },
    activeButton: {
        backgroundColor: '#3d9970',
    },
    buttonText: {
        color: '#3d9970',
        fontWeight: '600'
    },
    activeButtonText: {
        color: '#fff'
    },
    settingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 0.5,
        borderColor: '#ccc',
    },
    settingText: {
        fontSize: 16
    }
});

export default SettingsForm;
