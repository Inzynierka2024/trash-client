import React, { useState, useEffect, useContext } from 'react';
import { View, Text, ScrollView, StyleSheet, useColorScheme } from 'react-native';
import get_api_url from "../../Utils/get_api_url";
import _fetch from '../../Logic/API/_fetch';
import { ThemeContext, darkTheme, palette, theme } from "../../../theme/theme";
import { FontAwesome5 } from '@expo/vector-icons';

export const Scoreboard = () => {
    const theme = useContext(ThemeContext);
    const [base, setBase] = useState<string>('');
    const [scoreboardData, setScoreboardData] = useState<any[]>([]);
    const [darkMode, _setDarkMode] = useState(
        useColorScheme() === "dark" ? true : false
    );

    useEffect(() => {
        const fetchBaseUrl = async () => {
            const url = await get_api_url();
            setBase(url);
        };

        fetchBaseUrl();
    }, []);

    useEffect(() => {
        const fetchScoreboard = async () => {
            try {
                const response = await _fetch(`/ranking`, "GET", {});

                if (response.data && Array.isArray(response.data)) {
                    setScoreboardData(response.data);
                    console.log('>>> ', response.data);
                    console.log('Length of scoreboardData array:', response.data.length);
                } else {
                    setScoreboardData([]);
                    console.error('>>>empty');
                }
            } catch (error) {
                console.error('Error fetching scoreboard data:', error);
            }
        };

        if (base) {
            fetchScoreboard();
        }
    }, [base]);

    const renderScoreboardItem = (user, index) => {
        return (
            <View key={index} style={styles.item}>
                <View style={styles.scoreDetails}>
                    <Text style={styles.username}>
                        <Text style={styles.period}>{user.rank}. </Text>
                        {user.username}</Text>
                    <View style={styles.iconContainer}>
                        <FontAwesome5 name="coins" size={theme.spacing.m} color={theme.colors.primary} />
                        <Text style={styles.score}> {user.points} punktów</Text>
                    </View>
                    <Text style={styles.period}>Okres: {user.period}</Text>
                </View>
            </View>
        );
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Tablica Wyników</Text>
            {scoreboardData.map(renderScoreboardItem)}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 20,
        backgroundColor: theme.colors.secondary
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 10,
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.background,
        padding: 20,
        marginVertical: 16,
        marginHorizontal: 16,
        borderRadius: 10,
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },
    iconContainer: {
        marginRight: theme.spacing.m,
        marginTop: theme.spacing.s,
        marginBottom: theme.spacing.s,
        flexDirection: 'row',
    },
    scoreDetails: {
        flex: 1,
    },
    username: {
        fontWeight: 'bold',
        fontSize: theme.textVariants.body.fontSize,
    },
    score: {
        color: theme.colors.secondaryText,
    },
    period: {
        fontStyle: 'italic',
    },
});
