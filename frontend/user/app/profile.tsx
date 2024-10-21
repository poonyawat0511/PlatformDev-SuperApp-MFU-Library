import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, ImageBackground, StyleSheet } from 'react-native';
import axios from 'axios';

export default function Profile() {
  const [profile, setProfile] = useState<{ username: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('http://192.168.1.37:8082/api/users/profile');
        setProfile(response.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  return (
    <ImageBackground
      source={require('../assets/images/LibraryMFUBG.png')}
      imageStyle={{opacity:0.5}}
      style={styles.background}
    >
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>profile page, Welcome, {profile?.username}!</Text>
    </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover', 
  },
});