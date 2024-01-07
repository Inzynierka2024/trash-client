import React, { useState, useEffect, useContext } from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions, useColorScheme } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import get_heatmap_data from "../../../Logic/API/get_heatmap_data";
import get_trash_metadata from "../../../Logic/API/get_trash_metadata";
import get_garbage_statistics from '../../../Logic/API/get_garbage_statistics';
import { useAuth } from "../../../Logic/AuthContext";
import Geolocation from 'react-native-geolocation-service';
import { Loading } from '../../../Utils/Loading';
import { ThemeContext, darkTheme, theme } from '../../../../theme/theme';

const GarbageStatisticsView = () => {
    const { state } = useAuth();
    const [loading, setLoading] = useState(false);
    const [darkMode, _setDarkMode] = useState(
        useColorScheme() === "dark" ? true : false,
    );
    const themeFromContext = useContext(ThemeContext);
  const textColor = themeFromContext.colors.primaryText;
  const secondaryText = themeFromContext.colors.secondaryText;
  const background = themeFromContext.colors.background;
    async function getHistoryData() {
        try {
            const garbageResult = await get_garbage_statistics(new Date("2022-12-30").toISOString(), new Date("2024-01-30").toISOString());
            console.log(garbageResult);

            // Assuming garbageResult is a map of {label: value}
            const labels = Object.keys(garbageResult);
            const values = Object.values(garbageResult);

            setData({
                labels: labels,
                datasets: [
                    {
                        data: values,
                    },
                ],
            });

        } catch (error) {
            console.error("Error fetching garbage data:", error);
        }
    }

    useEffect(() => {
        setLoading(true);
        if (state.token) {
            getHistoryData().finally(() => setLoading(false));
        }
    }, [state.token]);


    const [data, setData] = useState({
        labels: [],
        datasets: [
            {
                data: [],
            },
        ],
    });


    const chartWidth = Dimensions.get('window').width - 30;

    return (
        <ThemeContext.Provider value={darkMode ? darkTheme : theme}>
            <View style={styles.container}>
                <Loading visible={loading} />
                <Text style={styles.title}>Histogram odpadów</Text>

                <ScrollView horizontal={true} showsHorizontalScrollIndicator={true}>
                    <BarChart
                        data={data}
                        width={chartWidth}
                        height={300}
                        yAxisLabel=""
                        chartConfig={{
                            backgroundColor: 'white',
                            backgroundGradientFrom: 'white',
                            backgroundGradientTo: 'white',
                            decimalPlaces: 0,
                            color: (opacity = 1) => `rgba(0, 100, 0, ${opacity})`,
                            labelColor: (opacity = 1) => `rgba(0, 100, 0, ${opacity})`,
                            style: {
                                borderRadius: 20,
                            },
                        }}
                        verticalLabelRotation={30}
                    />
                </ScrollView>

            </View>
        </ThemeContext.Provider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: theme.colors.green
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
});

export default GarbageStatisticsView;
