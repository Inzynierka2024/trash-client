import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import axios from 'axios';
import get_api_url from "../../Utils/get_api_url";
import get_jwt_token from "../../Utils/get_jwt_token";
import { join } from "path";
import _fetch from '../../Logic/API/_fetch';

const RankingContainer = () => {
  const [scoreboardData, setScoreboardData] = useState<any[]>([]);
  const [leaderboardData, setLeaderboardData] = useState<any[]>([]);
  const [base, setBase] = useState<string>('');

  useEffect(() => {
    const fetchBaseUrl = async () => {
      const url = await get_api_url();
      setBase(url);
    };

    fetchBaseUrl();
  }, []);

  useEffect(() => {
  const fetchScoreboard = async () => {
    try {
      const response = await _fetch(`/ranking`, "GET", {});
      setScoreboardData(response.data);
    } catch (error) {
      console.error('Error fetching scoreboard data:', error);
    }
  };

  const fetchLeaderboard = async () => {
    try {
      const response = await _fetch(`/leaderboard`, "GET", {});
      setLeaderboardData(response.data);
    } catch (error) {
      console.error('Error fetching leaderboard data:', error);
    }
  };

  if (base) {
    fetchScoreboard();
    fetchLeaderboard();
  }
}, [base]);


  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Scoreboard</Text>
      {scoreboardData.map((score, index) => (
        <View key={index} style={styles.item}>
          <Text>{score.username}: {score.score}</Text>
          <Text>Period: {score.period}</Text>
        </View>
      ))}
      {/* <Text style={styles.title}>Leaderboard</Text>
      {leaderboardData.map((leader, index) => (
        <View key={index} style={styles.item}>
          <Text>{index + 1}. {leader.username} - {leader.score}</Text>
        </View>
      ))} */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
});

export default RankingContainer;
