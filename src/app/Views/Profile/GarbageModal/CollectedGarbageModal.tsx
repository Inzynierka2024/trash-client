import React, { useContext, useEffect, useState } from "react";
import { ThemeContext, darkTheme, palette, theme } from "../../../../theme/theme";
import { View, Text, Image, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { TimestampToDate } from "./../../../Utils/convert_timestamp";
import calculate_distance from "../../../Utils/calculate_distance";
import MapLibreGL from "@maplibre/maplibre-react-native";

const CollectedGarbageModal = ({ visible, onClose, item }) => {
    const [userState, setUserState] = useState < MapLibreGL.Location > ({
        coords: { latitude: 0, longitude: 0 },
      });
    const themeFromContext = useContext(ThemeContext);
    const textColor = themeFromContext.colors.primaryText;
    const secondaryText = themeFromContext.colors.secondaryText;
    const background = themeFromContext.colors.background;

    const styles = StyleSheet.create({
        centeredView: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            marginTop: 22,
        },
        modalView: {
            margin: 20,
            backgroundColor: themeFromContext.colors.green,
            borderRadius: 20,
            padding: 35,
            alignItems: "center",
            shadowColor: themeFromContext.colors.primaryText,
            shadowOffset: {
                width: 4,
                height: 2
            },
            shadowOpacity: 0.1,
            shadowRadius: 20,
            elevation: 10
        },
        image: {
            width: 200,
            height: 200,
            borderRadius: 10,
        },
        textStyle: {
            color: textColor,
            fontWeight: "bold",
            textAlign: "center",
        },
        buttonClose: {
            backgroundColor: "red",
            borderRadius: 30,
            padding: 10,
            elevation: 2,
            marginTop: 15,
        },
        modalText: {
            marginBottom: 15,
            textAlign: "center",
        },
        tileRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '100%',
            marginTop: 5,
          },
    });

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    {item && (
                        <>
                            <Image
                                source={{ uri: `data:image/jpeg;base64,${item.picture}` }}
                                style={{ width: 100, height: 100, borderRadius: 10 }}
                            />
                            <View>
                                <View>
                            <View style={styles.tileRow}>
                                <Text style={styles.textStyle}>Zgłoszono: {item.creation_username}</Text>
                                <Text style={styles.textStyle}>({TimestampToDate(item.creation_timestamp)})</Text>
                            </View>
                            <View style={styles.tileRow}>
                                <Text style={styles.textStyle}>Zebrano: {item.collection_username}</Text>
                                <Text style={styles.textStyle}>({TimestampToDate(item.collection_timestamp)})</Text>
                            </View>
                            </View>
                            <Text style={styles.textStyle}>Rozmiar: {item.size}</Text>
                            <Text style={styles.textStyle}>Typ: {item.type}</Text>
                            <Text style={styles.textStyle}>
                                Odległość: {
                                    Math.round(
                                        calculate_distance(
                                            userState.coords.latitude,
                                            userState.coords.longitude,
                                            item.latitude,
                                            item.longitude) * 100) / 100
                                } 
                                km
                            </Text>
                            </View>
                        </>
                    )}
                    <TouchableOpacity style={styles.buttonClose} onPress={onClose}>
                        <Text style={styles.textStyle}>X</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

export default CollectedGarbageModal;
