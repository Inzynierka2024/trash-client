import React, { useState, useEffect, useContext } from 'react';
import { View, Text, ScrollView, StyleSheet, useColorScheme, Image, RefreshControl } from 'react-native';
import get_api_url from "../../Utils/get_api_url";
import _fetch from '../../Logic/API/_fetch';
import { ThemeContext, darkTheme, palette, theme } from "../../../theme/theme";
import pointsIcon from "../../../../assets/profile/coin.png";
import rankingIcon from "../../../../assets/trophy.png";
import periodIcon from "../../../../assets/period.png";
import get_all_scoreboard from '../../Logic/API/get_all_scoreboard';
import { Loading } from '../../Utils/Loading';
import { useIsFocused } from '@react-navigation/native';

export interface RankingData {
  rank: number;
  username: string;
  period: string;
  points?: number;
}

export const Scoreboard = () => {
  const [loading, setLoading] = useState(false);
  const theme = useContext(ThemeContext);
  const [base, setBase] = useState < string > ('');
  const [scoreboardData, setScoreboardData] = useState < any[] > ([]);

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

  async function fetchNewMapMarkers() {
    const result = await get_all_scoreboard();

    if (result.isOk) {
      console.log(result);
      const users = result["data"];
      console.log(users);
      return users;
    } else {
      console.error("Invalid user");
      return [];
    }
  }

  async function updateScoreboard() {
    const markers = await fetchNewMapMarkers();
    setScoreboardData(markers);
  }

  const onRefresh = React.useCallback(async () => {
    setLoading(true);
    try {
      const newScoreboardData = await fetchNewMapMarkers();
      setScoreboardData(newScoreboardData);
    } catch (error) {
      console.error("Error refreshing scoreboard data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (base) {
      setLoading(true);
      updateScoreboard();
      setLoading(false);
    }
  }, [base]);

  const isFocused = useIsFocused();

  useEffect(() => {
    async function fetchDataOnFocus() {
      if (isFocused) {
        await updateScoreboard();
      }
    }
    fetchDataOnFocus();
  }, [isFocused]);
  
  const renderScoreboardItem = (user, index) => {
    return (
      <View key={index} style={styles.item}>
        <Loading visible={loading} />
        <View style={styles.scoreDetails}>
          <View style={styles.iconContainer}>
            <Image source={rankingIcon} style={styles.pointsIcon} />
            <Text style={styles.username}> <Text style={styles.ranking}>{user.rank}. </Text>{user.username}</Text>
          </View>
          <View style={styles.iconContainer}>
            <Image source={pointsIcon} style={styles.pointsIcon} />
            <Text style={styles.score}> {user.points} punktów</Text>
          </View>
          <View style={styles.iconContainer}>
          <Image source={periodIcon} style={styles.pointsIcon} />
            <Text style={styles.period}>{user.period}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={loading}
          onRefresh={onRefresh}
        />
      }
    >
      <Text style={styles.title}>Wyniki gracza</Text>
      {scoreboardData.map(renderScoreboardItem)}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
    backgroundColor: theme.colors.green
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
    fontSize: 16,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 5,
  },
  pointsContainer: {
    flex: 1,
    paddingTop: 10,
    justifyContent: "flex-start",
    flexDirection: "row",
    alignItems: "flex-start",
  },
  pointsIcon: {
    width: 30,
    height: 30,
    marginLeft: 5,
    resizeMode: "contain",
  },
  scoreDetails: {
    flex: 1,
  },
  username: {
    fontWeight: 'bold',
    fontSize: theme.textVariants.body.fontSize,
    marginLeft: 5,
  },
  score: {
    color: theme.colors.primaryText,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  ranking: {
    fontWeight: 'bold',
  },
  period: {
    fontWeight: 'bold',
    marginLeft: 5,
  },
});
