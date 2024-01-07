import React, { useState, useEffect  } from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import get_heatmap_data from "../../../Logic/API/get_heatmap_data";
import get_trash_metadata from "../../../Logic/API/get_trash_metadata";
import get_garbage_statistics from '../../../Logic/API/get_garbage_statistics';
import { useAuth } from "../../../Logic/AuthContext";
import Geolocation from 'react-native-geolocation-service';

const GarbageStatisticsView = () => {
    const { state } = useAuth();
    
    async function getHistoryData() {
        try {
            const garbageResult = await get_garbage_statistics(new Date("2022-12-30").toISOString(),new Date("2024-01-30").toISOString());
           
        } catch (error) {
            console.error("Error fetching garbage data:", error);
        }
    }

    useEffect(() => {
        if (state.token) {
            getHistoryData();
        }
    }, [state.token]);

    const [data, setData] = useState({
        labels: ['Plastic', 'Organic', 'Paper', 'Metal', 'Glass', 'Other', 'Extra1', 'Extra2'], // More labels for demonstration
        datasets: [
            {
                data: [300, 500, 200, 80, 120, 50, 60, 70], // Corresponding data
            },
        ],
    });

    // Define the chart width based on the number of data points
    const chartWidth = data.labels.length * 50; // Adjust as needed

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Histogram odpadów</Text>

            {/* ScrollView for horizontal scrolling */}
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={true}>
                <BarChart
                    data={data}
                    width={chartWidth} // Set the dynamic width
                    height={300}
                    yAxisLabel=""
                    chartConfig={{
                        backgroundColor: '#e26a00',
                        backgroundGradientFrom: 'green',
                        backgroundGradientTo: 'white',
                        decimalPlaces: 0,
                        color: (opacity = 0.2) => `rgba(0, 0, 12, ${opacity})`,
                        labelColor: (opacity = 0.9) => `rgba(35, 0, 0, ${opacity})`,
                        style: {
                            borderRadius: 8,
                        },
                    }}
                    verticalLabelRotation={30}
                />
            </ScrollView>

            <ScrollView horizontal={true} showsHorizontalScrollIndicator={true}>
                <BarChart
                    data={data}
                    width={chartWidth} // Set the dynamic width
                    height={300}
                    yAxisLabel=""
                    chartConfig={{
                        backgroundColor: '#e26a00',
                        backgroundGradientFrom: 'green',
                        backgroundGradientTo: 'white',
                        decimalPlaces: 0,
                        color: (opacity = 0.5) => `rgba(0, 0, 120, ${opacity})`,
                        labelColor: (opacity = 0.5) => `rgba(0, 0, 0, ${opacity})`,
                        style: {
                            borderRadius: 16,
                        },
                    }}
                    verticalLabelRotation={30}
                />
            </ScrollView>


        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
});

export default GarbageStatisticsView;
