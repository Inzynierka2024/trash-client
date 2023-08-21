import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import Ionicons from 'react-native-ionicons';

type Player = {
  id: string;
  name: string;
  reportedLitterPoints: number;
  collectedLitterPoints: number;
};

const DUMMY_DATA: Player[] = [
  { id: '1', name: 'John', reportedLitterPoints: 50, collectedLitterPoints: 100 },
  { id: '2', name: 'LitterEater', reportedLitterPoints: 30, collectedLitterPoints: 200 },
  { id: '3', name: 'TrashCollector', reportedLitterPoints: 20, collectedLitterPoints: 150 },
  { id: '4', name: 'GreenGoblin', reportedLitterPoints: 40, collectedLitterPoints: 180 },
  { id: '5', name: 'NatureNinja', reportedLitterPoints: 60, collectedLitterPoints: 250 },
  { id: '6', name: 'EcoWarrior', reportedLitterPoints: 70, collectedLitterPoints: 300 },
  { id: '7', name: 'PlanetProtector', reportedLitterPoints: 25, collectedLitterPoints: 120 },
  { id: '8', name: 'WasteWizard', reportedLitterPoints: 55, collectedLitterPoints: 220 },
];


const RankingContainer: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    setPlayers(DUMMY_DATA);
  }, []);

  const renderItem = ({ item }: { item: Player }) => (
    <View style={styles.playerRow}>
      <Text style={styles.playerName}>{item.name}</Text>
      <View style={styles.pointsContainer}>
        <Ionicons name="trash-outline" size={20} color="#3d9970" />
        <Text style={styles.points}>{item.reportedLitterPoints}</Text>
      </View>
      <View style={styles.pointsContainer}>
        <Ionicons name="checkmark-circle-outline" size={20} color="#3d9970" />
        <Text style={styles.points}>{item.collectedLitterPoints}</Text>
      </View>
      <Text style={styles.totalPoints}>
        {item.reportedLitterPoints + item.collectedLitterPoints}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ranking</Text>
      <View style={styles.headerRow}>
        <Text style={[styles.playerName, styles.header]}>Name</Text>
        <Text style={[styles.points, styles.header]}>Reported</Text>
        <Text style={[styles.points, styles.header]}>Collected</Text>
        <Text style={[styles.totalPoints, styles.header]}>Total</Text>
      </View>
      <FlatList
        data={players.sort((a, b) =>
          a.reportedLitterPoints + a.collectedLitterPoints > b.reportedLitterPoints + b.collectedLitterPoints ? -1 : 1
        )}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#3d9970',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#3d9970',
    marginBottom: 8,
  },
  playerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: '#fff',
    marginBottom: 8,
    borderRadius: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  playerName: {
    flex: 3, // Increased the flex value for names as they might be longer
    fontSize: 16,
    fontWeight: '500',
  },
  pointsContainer: {
    flex: 2, // Made this consistent with the header
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  points: {
    flex: 2, // Made this consistent with the header
    textAlign: 'center',
  },
  totalPoints: {
    flex: 1,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#3d9970',
  },
  header: {
    fontWeight: 'bold',
    color: '#3d9970',
  },
});

export default RankingContainer;
