import React, { useEffect, useState } from 'react';
import { View, TextInput, Button, StyleSheet, ToastAndroid } from 'react-native';
import _fetch from '../../Logic/API/_fetch';
import { useAuth } from '../../Logic/AuthContext';
import get_user_data from '../../Logic/API/get_user_data';

const ProfileEditForm: React.FC = () => {
  const { state } = useAuth();
  const [userData, setUserData] = useState(
    {
      email: '',
      location: {
        city: '',
        country: '',
      },
      username: '',
      stats: {
        points: '',
        gatheredTrash: '',
        reportedTrash: ''
      }
    });

  useEffect(() => {
    // Here you can fetch the current user data to populate the fields
    // Assuming you have a function to fetch user data
  }, []);

  const handleInputChange = (field, value) => {
    setUserData(prevState => ({ ...prevState, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!state.token) {
      ToastAndroid.show('No authentication token found', ToastAndroid.SHORT);
      return;
    }

    const success = await editUserData(userData);
    if (success) {
      ToastAndroid.show('User updated successfully', ToastAndroid.SHORT);
    } else {
      ToastAndroid.show('Error updating user', ToastAndroid.SHORT);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Email"
        onChangeText={value => handleInputChange('email', value)}
        value={userData.email}
      />

      <TextInput
        style={styles.input}
        placeholder="City"
        onChangeText={value => handleInputChange('location.city', value)}
        value={userData.location.city}
      />

      <TextInput
        style={styles.input}
        placeholder="Country"
        onChangeText={value => handleInputChange('location.country', value)}
        value={userData.location.country}
      />
      <Text style={styles.readOnly}>Gathered Trash: {userData.stats.gatheredTrash}</Text>
      <Text style={styles.readOnly}>Reported Trash: {userData.stats.reportedTrash}</Text>
      <Text style={styles.readOnly}>Points: {userData.stats.points}</Text>

      <Button title="Save Changes" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    width: '90%',
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  readOnly: {
    fontSize: 16,
    marginVertical: 8,
    color: '#333333',
    width: '100%',
    textAlign: 'left',
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC',
    paddingBottom: 4,
  },
});

export default ProfileEditForm;


