import React, { useState, useEffect, useContext } from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions, useColorScheme, Button, TouchableOpacity } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import get_garbage_statistics from '../../../Logic/API/get_garbage_statistics';
import { useAuth } from "../../../Logic/AuthContext";
import { Loading } from '../../../Utils/Loading';
import { ThemeContext, darkTheme, theme } from '../../../../theme/theme';
import DatePicker from 'react-native-date-picker';

const GarbageStatisticsView = () => {
    const { state } = useAuth();
    const [loading, setLoading] = useState(false);
    const [darkMode, _setDarkMode] = useState(
        useColorScheme() === "dark" ? true : false,
    );

    const [startDate, setStartDate] = useState(new Date(2023, 10, 10));
    const [endDate, setEndDate] = useState(new Date());
    const [openStart, setOpenStart] = useState(false);
    const [openEnd, setOpenEnd] = useState(false);

    const formatDate = (date) => {
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    };

    const handleStartConfirm = (newDate) => {
        setOpenStart(false);
        setStartDate(newDate);

        if (endDate < newDate) {
            setEndDate(newDate);
            getHistoryData();
        }
    };

    const handleEndConfirm = (newDate) => {
        setOpenEnd(false);
        if (newDate >= startDate) {
            setEndDate(newDate);
            getHistoryData();
        }
    };

    async function getHistoryData() {
        try {
            const garbageResult = await get_garbage_statistics(startDate.toISOString(), endDate.toISOString());
            console.log(garbageResult);

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
        labels: ['0', '0', '0'],
        datasets: [
            {
                data: ['0', '0', '0'],
            },
        ],
    });


    const chartWidth = Dimensions.get('window').width - 30;

    return (
        <ThemeContext.Provider value={darkMode ? darkTheme : theme}>
            <View style={styles.container}>
                <Loading visible={loading} />

                <Text style={styles.title}>Histogram odpadów</Text>

                <View style={styles.datePickerRow}>
                    <TouchableOpacity onPress={() => setOpenStart(true)} style={styles.dateDisplay}>
                        <Text style={styles.dateText}>Od: {formatDate(startDate)}</Text>
                    </TouchableOpacity>
                    <DatePicker
                        modal
                        open={openStart}
                        date={startDate}
                        onConfirm={handleStartConfirm}
                        onCancel={() => setOpenStart(false)}
                        mode="date"
                    />

                    <TouchableOpacity onPress={() => setOpenEnd(true)} style={styles.dateDisplay}>
                        <Text style={styles.dateText}>Do: {formatDate(endDate)}</Text>
                    </TouchableOpacity>
                    <DatePicker
                        modal
                        open={openEnd}
                        date={endDate}
                        onConfirm={handleEndConfirm}
                        onCancel={() => setOpenEnd(false)}
                        minimumDate={startDate}
                        mode="date"
                    />
                </View>

                <ScrollView horizontal={true} showsHorizontalScrollIndicator={true}>
                    <BarChart
                        data={data}
                        width={chartWidth}
                        height={350}
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
    dateDisplay: {
        padding: 10,
        backgroundColor: theme.colors.contrastOverlay,
        borderRadius: 5,
        margin: 5,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowRadius: 3.84,

        elevation: 5,
    },
    datePickerRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    dateText: {
        fontSize: 17,
        fontWeight: 'bold',
    },
    heatmapActionsContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 20,
        // gap: 24,
        width: 192,
        height: 40,
    },
});

export default GarbageStatisticsView;
