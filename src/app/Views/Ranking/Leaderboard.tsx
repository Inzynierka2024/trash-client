import React, { useState, useEffect, useContext } from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView, useColorScheme, Image, RefreshControl } from 'react-native';
import get_api_url from "../../Utils/get_api_url";
import _fetch from '../../Logic/API/_fetch';
import { ThemeContext, darkTheme, palette, theme } from "../../../theme/theme";
import { useAuth } from "../../Logic/AuthContext";
import pointsIcon from "../../../../assets/profile/coin.png";
import rankingIcon from "../../../../assets/trophy.png";
import get_all_leaderboard from '../../Logic/API/get_all_leaderboard';
import { Loading } from '../../Utils/Loading';
import { useIsFocused } from '@react-navigation/native';

export const Leaderboard = () => {
  const [loading, setLoading] = useState(false);
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
      setLeaderboardData(user);
    } else {
      console.error("Invalid user");
    }
  }

  const isFocused = useIsFocused();

  useEffect(() => {
    async function fetchDataOnFocus() {
      if (isFocused) {
        await getLeaderboard();
      }
    }
    fetchDataOnFocus();
  }, [isFocused]);
  
  useEffect(() => {
    setLoading(true);
    async function fetchData() {
      if (state.token) {
        await getLeaderboard();
        setLoading(false);
      }
    }
    fetchData();
  }, [state.token]);

  const onRefresh = React.useCallback(async () => {
    setLoading(true);
    try {
      await getLeaderboard();
    } catch (error) {
      console.error("Error refreshing scoreboard data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const renderLeaderboardItem = (score, index) => {
    return (
      <View key={index} style={styles.item}>

<View style={styles.iconContainer}>
          <Image source={rankingIcon} style={styles.pointsIcon} />
          <Text style={styles.score}>{score.rank}</Text>
        </View>

        <Text style={styles.username}>{score.username}</Text>

        <View style={styles.iconContainer}>
          <Image source={pointsIcon} style={styles.pointsIcon} />
          <Text style={styles.score}>{score.points} punktów</Text>
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
      <Loading visible={loading} />
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
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    margin: 5,
    justifyContent: 'space-between',
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scoreDetails: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
  },
  username: {
    flex: 1,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: theme.textVariants.body.fontSize,
  },
  score: {
    color: theme.colors.primaryText,
    marginTop: 3,
    marginLeft: 5,
    fontWeight: 'bold',
  },
  period: {
    fontWeight: 'bold',
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