import {View, Text, Image, StyleSheet} from "react-native";
import round from "../../Utils/round";
import {ElementTypes} from "../../Models/ElementTypes";
import {useContext} from "react";
import {palette, ThemeContext} from "../../../theme/theme";
import {ElementNames} from "../../Models/ElementNames";
import {ElementIcons} from "../../Models/ElementIcons";
import {ElementColors} from "../../Models/ElementColors";

export const ElementCard = (props: {
    type: ElementTypes,
    imageEnabled: boolean,
    imageData?: string,
    distance: number,
    timestamp?: Date,
    addedBy?: string
}) => {
    const themeFromContext = useContext(ThemeContext);
    const textColor = themeFromContext.colors.primaryText
    const backgroundColor = themeFromContext.colors.background

    return (
        <View style={styles.container}>
            {props.imageEnabled === true && (
                <Image
                    source={{
                        uri: "data:image/jpg;base64," + props.imageData,
                    }}
                    style={styles.image}
                />
            )}

            <View style={styles.row}>
                <Image
                    style={[styles.elementIcon, {backgroundColor: ElementColors[props.type]}]}
                    source={ElementIcons[props.type]}/>

                <View style={[styles.info, {backgroundColor}]}>
                    <Text numberOfLines={1} style={{
                        color: textColor,
                        fontWeight: 600,
                        fontSize: 17,
                    }}>{ElementNames[props.type]}</Text>
                    <Text
                        style={{
                            color: textColor,
                        }}
                    >
                        Odległość: {props.distance !== -1 ? round(props.distance, 2) : "-"}km
                    </Text>

                    {props.addedBy && (
                        <Text
                            style={{
                                color: textColor,
                            }}
                        >
                            Dodane przez: {props.addedBy}
                        </Text>
                    )}

                    {props.timestamp && (
                        <Text
                            style={{
                                color: textColor,
                            }}
                        >
                            Data: {props.timestamp.toLocaleString()}
                        </Text>
                    )}
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: 260
    },
    image: {
        aspectRatio: "1 / 1",
        resizeMode: "contain",
        height: 260,
        width: 260,
        backgroundColor: "black"
    },
    row: {
        flexDirection: "row",
        height: 80,
    },
    elementIcon: {
        height: 80,
        width: 80,
    },
    info: {
        flex: 1,
        padding: 6,
    }
});