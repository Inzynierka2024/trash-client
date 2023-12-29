import { View, Text, Image, StyleSheet } from "react-native";
import round from "../../Utils/round";
import { ElementTypes } from "../../Models/ElementTypes";
import { useContext, useEffect, useState } from "react";
import { palette, ThemeContext } from "../../../theme/theme";
import { ElementNames } from "../../Models/ElementNames";
import { ElementIcons } from "../../Models/ElementIcons";
import { ElementColors } from "../../Models/ElementColors";
import { BinStatus, BinStatusNames } from "../../Models/BinStatus";
import get_address from "../../Logic/API/get_address";
import { Address } from "../../Models/Address";

export const ElementCard = (props: {
  lat: number;
  lng: number;
  type: ElementTypes;
  imageEnabled: boolean;
  imageData?: string;
  distance?: number;
  timestamp?: Date;
  addedBy?: string;
  binStatus?: BinStatus;
}) => {
  const themeFromContext = useContext(ThemeContext);
  const textColor = themeFromContext.colors.primaryText;
  const backgroundColor = themeFromContext.colors.background;

  const [address, setAddress] = useState<Address | null | undefined>(undefined);

  useEffect(() => {
    get_address(props.lat, props.lng)
      .then((result) => {
        setAddress(result);
      })
      .catch((err) => {
        console.error(err);
        setAddress(null);
      });
  }, []);

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
          style={[
            styles.elementIcon,
            { backgroundColor: ElementColors[props.type] },
          ]}
          source={ElementIcons[props.type]}
        />

        <View style={[styles.info, { backgroundColor }]}>
          <Text
            numberOfLines={2}
            style={{
              color: textColor,
              fontWeight: "600",
              fontSize: 17,
            }}
          >
            {ElementNames[props.type]}
          </Text>

          {address !== null && (
            <Text
              style={{
                color: textColor,
              }}
              numberOfLines={1}
            >
              {address !== undefined &&
                `${address.address.road}, ${
                  address.address.town ?? address.address.city
                }`}
              {address === undefined && "..."}
            </Text>
          )}

          {props.distance && (
            <Text
              style={{
                color: textColor,
              }}
            >
              Odległość:{" "}
              {props.distance !== -1 ? `${round(props.distance, 2)}km` : "..."}
            </Text>
          )}

          {props.addedBy && (
            <Text
              style={{
                color: textColor,
              }}
              numberOfLines={1}
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

          {props.binStatus && (
            <Text
              style={{
                color: textColor,
              }}
            >
              Stan: {BinStatusNames[props.binStatus]}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 260,
  },
  image: {
    aspectRatio: "3 / 4",
    resizeMode: "contain",
    width: 260,
    backgroundColor: "black",
  },
  row: {
    flexDirection: "row",
  },
  elementIcon: {
    height: "100%",
    minHeight: 80,
    resizeMode: "contain",
    width: 80,
  },
  info: {
    flex: 1,
    padding: 6,
  },
});
