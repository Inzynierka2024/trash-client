import { StyleSheet, View, ScrollView, Text } from "react-native";
import { ThemeContext } from "../../../theme/theme";
import { useContext, useState } from "react";
import { RecyclingInfo } from "./RecyclingInfo";
import { ElementColors } from "../../Models/ElementColors";
import { ElementTypes } from "../../Models/ElementTypes";

export const RecyclingScreen = () => {
  const themeFromContext = useContext(ThemeContext);
  const textColor = themeFromContext.colors.primaryText;
  const background = themeFromContext.colors.background;

  const [active, setActive] = useState<ElementTypes | null>(null);

  const close = () => setActive(null);

  return (
    <ScrollView
      style={[
        styles.container,
        {
          backgroundColor: background,
        },
      ]}
    >
      <Text
        style={[
          styles.title,
          {
            color: textColor,
          },
        ]}
      >
        Segregacja odpadów
      </Text>
      <RecyclingInfo
        name="Metale i tworzywa sztuczne"
        color={ElementColors.plastic}
        active={active === "plastic"}
        setActive={() => {
          setActive("plastic");
        }}
        close={close}
        height={244}
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
        active={active === "paper"}
        setActive={() => {
          setActive("paper");
        }}
        close={close}
        height={264}
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
        active={active === "glass"}
        setActive={() => {
          setActive("glass");
        }}
        close={close}
        height={236}
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
        active={active === "bio"}
        setActive={() => {
          setActive("bio");
        }}
        close={close}
        height={200}
        content={[
          [
            "odpadki kuchenne, resztki jedzenia",
            "gałęzie, trawy, liście, trociny, korę drzew",
            "niezaimpregnowane drewno",
          ],
          ["odchody zwierząt", "popiół", "ziemię, kamienie", "płyt wiórowych"],
        ]}
      />

      <RecyclingInfo
        name="Kontenery na odzież"
        color={ElementColors.cloth}
        active={active === "cloth"}
        setActive={() => {
          setActive("cloth");
        }}
        close={close}
        height={224}
        content={[
          [
            "suchą, nieporwaną, czytą odzież",
            "związane, czyste, sparowane obuwie",
            "czystą pościel",
            "czyste zabawki",
            "pluszaki",
          ],
          [
            "stare, zniszczone kołdry, poduszki, kożuchy",
            "śmieci, odpady komunalne",
            "puszki, żywność, drewno opałowe",
            "małe zabawki",
          ],
        ]}
      />

      <RecyclingInfo
        name="Elektrośmieci"
        color={ElementColors["e-waste"]}
        active={active === "e-waste"}
        setActive={() => {
          setActive("e-waste");
        }}
        close={close}
        height={246}
        content={[
          [
            "sprzęt AGD, RTV",
            "telewizory, monitory, drukarki, skanery",
            "telefony komórkowe",
            "baterie, akumulatory",
            "żarówki, świetlówki",
            "inne sprzęty zasilane na prąd lub na baterie",
          ],
          [],
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
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 32,
    marginTop: 8,
  },
});
