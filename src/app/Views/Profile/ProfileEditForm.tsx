import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  StyleSheet,
  TouchableOpacity,
  ToastAndroid,
} from 'react-native';

const ProfileEditForm: React.FC = () => {
  const [profile, setProfile] = useState({
    picture: null,  // assuming this will be a URI link to an image
    username: '',
    email: '',
    fullname: '',
    password: '',
    location: {
      city: '',
      country: '',
    },
    stats: {
      gatheredTrash: 0,
      reportedTrash: 0,
    },
    points: 0,
  });

  const handleInputChange = (field, value) => {
    if (field in profile) {
      setProfile(prevState => ({ ...prevState, [field]: value }));
      ToastAndroid.show('Data updated successfully!', ToastAndroid.SHORT);
    }
  };

  return (
    <View style={styles.container}>
      {/* <Image source={{ uri: profile.picture }} style={styles.profileImage} /> */}

      <TextInput
        style={styles.input}
        placeholder="Username"
        onChangeText={value => handleInputChange('username', value)}
        value={profile.username}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        onChangeText={value => handleInputChange('email', value)}
        value={profile.email}
      />

      <TextInput
        style={styles.input}
        placeholder="Full Name"
        onChangeText={value => handleInputChange('fullname', value)}
        value={profile.fullname}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        onChangeText={value => handleInputChange('password', value)}
        value={profile.password}
      />

      <TextInput
        style={styles.input}
        placeholder="City"
        onChangeText={value => handleInputChange('location.city', value)}
        value={profile.location.city}
      />

      <TextInput
        style={styles.input}
        placeholder="Country"
        onChangeText={value => handleInputChange('location.country', value)}
        value={profile.location.country}
      />

      <Text style={styles.readOnly}>
        Gathered Trash: {profile.stats.gatheredTrash}
      </Text>

      <Text style={styles.readOnly}>
        Reported Trash: {profile.stats.reportedTrash}
      </Text>

      <Text style={styles.readOnly}>Points: {profile.points}</Text>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
    borderColor: '#3d9970',
    borderWidth: 3,
  },
  input: {
    width: '90%',
    height: 40,
    marginBottom: 16,
    paddingHorizontal: 12,
    borderColor: '#3d9970',
    borderWidth: 2,
    borderRadius: 8,
    color: '#333',
    backgroundColor: '#ffffff',
  },
  readOnly: {
    fontSize: 16,
    marginVertical: 4,
    color: '#3d9970',
  },
});

export default ProfileEditForm;
