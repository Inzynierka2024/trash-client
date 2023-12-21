import { StyleSheet, View, ScrollView } from "react-native";
import { ThemeContext } from "../../../theme/theme";
import { useContext } from "react";
import { RecyclingInfo } from "./RecyclingInfo";
import { ElementColors } from "../../Models/ElementColors";

export const RecyclingScreen = () => {
  const themeFromContext = useContext(ThemeContext);
  const textColor = themeFromContext.colors.primaryText;
  const background = themeFromContext.colors.background;

  return (
    <ScrollView
      style={[
        styles.container,
        {
          backgroundColor: background,
        },
      ]}
    >
      <RecyclingInfo
        name="Metale i tworzywa sztuczne"
        color={ElementColors.plastic}
        height={200}
        content={[
          [
            "zgniecione butelki",
            "plastikowe opakowania",
            "puszki",
            "folię",
            "metale kolorowe",
            "kapsle, zakrętki",
          ],
          [
            "butelek z zawartością",
            "zabawki",
            "opakowania po farbach i lakierach",
            "opakowania po olejach silnikowych",
          ],
        ]}
      />

      <RecyclingInfo
        name="Papier"
        color={ElementColors.paper}
        height={200}
        content={[
          [
            "opakowania z papieru",
            "ulotki, gazety, czasopisma",
            "zeszyty, książki",
            "kartony",
            "torby, worki papierowe",
          ],
          [
            "ręczniki papierowe",
            "zużyte chusteczki",
            "zatłuszczony, zabrudzony papier",
            "kartony po mleku i napojach",
            "pieluch",
            "ubrań",
          ],
        ]}
      />

      <RecyclingInfo
        name="Szkło"
        color={ElementColors.glass}
        height={200}
        content={[
          ["butelki, słoiki", "szklane opakowania"],
          [
            "ceramikę, porcelanę, fajans",
            "zniczy",
            "luster, szyb",
            "żarówek",
            "monitorów",
            "termometrów, strzykawek",
          ],
        ]}
      />

      <RecyclingInfo
        name="Bio"
        color={ElementColors.bio}
        height={160}
        content={[
          [
            "odpadki kuchenne, resztki jedzenia",
            "gałęzie, trawy, liście, trociny, korę drzew",
            "niezaimpregnowane drewno",
          ],
          ["odchody zwierząt", "popiół", "ziemię, kamienie", "płyt wiórowych"],
        ]}
      />

      <View
        style={{
          height: 128,
        }}
      ></View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 32,
    paddingBottom: 128,
  },
});
