import { StyleSheet, View, ScrollView, Text } from "react-native";
import { ThemeContext } from "../../../theme/theme";
import { useContext, useState } from "react";
import { RecyclingInfo } from "./RecyclingInfo";
import { ElementColors } from "../../Models/ElementColors";
import { ElementTypes } from "../../Models/ElementTypes";
import { FontAwesome } from "@expo/vector-icons";

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
      <FontAwesome
        style={[styles.titleicon]}
        name="recycle"
        size={64}
        color={textColor}
      />

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

      <Text
        style={[
          styles.subtitle,
          {
            color: textColor,
          },
        ]}
      >
        co gdzie możesz wyrzucać
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
            "folia",
            "metale kolorowe",
            "kapsle, zakrętki",
          ],
          [
            "butelki z zawartością",
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
            "piely",
            "ubrania",
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
            "ceramika, porcelana, fajans",
            "znicze",
            "lustra, szyby",
            "żarówki",
            "monitory",
            "termometry, strzykawki",
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
            "gałęzie, trawy, liście, trociny, kora drzew",
            "niezaimpregnowane drewno",
          ],
          ["odchody zwierząt", "popiół", "ziemia, kamienie", "płyty wiórowe"],
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
            "sucha, nieporwana, czyta odzież",
            "związane, czyste, sparowane obuwie",
            "czysta pościel",
            "czyste zabawki",
            "pluszaki",
          ],
          [
            "stare, zniszczone kołdry, poduszki, kożuchy",
            "odpady komunalne",
            "puszki, żywność, drewno opałowe",
            "małe zabawki",
          ],
        ]}
      />

      <RecyclingInfo
        name="Elektroodpady"
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
          ["akumulatory samochodowe", "baterie"],
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
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "normal",
    textAlign: "center",
    marginBottom: 32,
  },
  titleicon: {
    textAlign: "center",
    marginVertical: 16,
  },
});
