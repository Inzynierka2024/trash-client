import React, { useState, useEffect, useContext } from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView, useColorScheme, Image } from 'react-native';
import get_api_url from "../../Utils/get_api_url";
import _fetch from '../../Logic/API/_fetch';
import { ThemeContext, darkTheme, palette, theme } from "../../../theme/theme";
import { useAuth } from "../../Logic/AuthContext";
import pointsIcon from "../../../../assets/profile/coin.png";
import rankingIcon from "../../../../assets/trophy.png";
import get_all_leaderboard from '../../Logic/API/get_all_leaderboard';

export const Leaderboard = () => {
  const theme = useContext(ThemeContext);
  const [base, setBase] = useState < string > ('');
  const { state } = useAuth();
  const [leaderboardData, setLeaderboardData] = useState < any[] > ([]);

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

  async function getLeaderboard() {
    const result = await get_all_leaderboard(state.token);
    if (result.isOk) {
      const user = result["data"];
      return user;
    } else {
      console.error("Invalid user");
      return [];
    }
  }

  useEffect(() => {
    async function fetchData() {
      if (state.token) {
        const leaderboard = await getLeaderboard();
        setLeaderboardData(leaderboard);
      }
    }
    fetchData();
  }, [state.token]);

  const renderLeaderboardItem = (score, index) => {
    return (
      <View key={index} style={styles.item}>

        <View style={styles.scoreDetails}>
          <View style={styles.iconContainer}>
            <Image source={rankingIcon} style={styles.pointsIcon} />
            <Text style={styles.username}> <Text style={styles.period}>{score.rank}. </Text>{score.username}</Text>
          </View>

          <View style={styles.iconContainer}>
            <Image source={pointsIcon} style={styles.pointsIcon} />
            <Text style={styles.score}> {score.points} punktów</Text>
          </View>

        </View>
      </View>
    );
  };


  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Ranking</Text>
      {leaderboardData.map(renderLeaderboardItem)}
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
  scoreDetails: {
    flex: 1,
  },
  username: {
    fontWeight: 'bold',
    fontSize: theme.textVariants.body.fontSize,
  },
  score: {
    color: theme.colors.secondaryText,
    marginTop: 3,
    marginLeft: 5,
  },
  period: {
    fontWeight: 'bold',
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin:5,
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
});