import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, Image, ActivityIndicator, ImageBackground, StyleSheet, Button, FlatList, Alert } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';

interface Reservation {
  id: string;
  room: { id: string; room: number };
  timeSlot: { id: string; start: string; end: string };
  type: string;
  dateTime: string;
  user: { id: string; username: string };
}

export default function Profile() {
  const [profile, setProfile] = useState<{ username: string; email: string } | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const router = useRouter();

  const fetchProfileAndReservations = async () => {
    try {
      const profileResponse = await axios.get('http://192.168.1.37:8082/api/users/profile');
      setProfile(profileResponse.data);

      const reservationResponse = await axios.get('http://192.168.1.37:8082/api/reservations/');
      const userReservations = reservationResponse.data.data.filter((res: Reservation) => res.user.username === profileResponse.data.username);
      setReservations(userReservations);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileAndReservations();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchProfileAndReservations();
    }, [])
  );

  const handleLogout = async () => {
    try {
      const response = await axios.post('http://192.168.1.37:8082/api/auth/logout');
      if (response.data.message === 'Logout successful') {
        Alert.alert('Success', 'You have logged out successfully.', [
          { text: 'OK', onPress: () => router.push('./login') },
        ]);
      }
    } catch (error) {
      console.error('Error logging out:', error);
      Alert.alert('Error', 'Logout failed. Please try again.');
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  return (
    <ImageBackground
      source={require('../assets/images/LibraryMFUBG.png')}
      imageStyle={{ opacity: 0.5 }}
      style={styles.background}
    >
      <View style={styles.container}>
        <View style={{ alignItems: 'center', marginBottom: 10, marginTop: 20 }}>
          <Image source={require('../assets/images/LibraryMFUprofile.png')} />
        </View>

        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{profile?.username}</Text>
          <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{profile?.email}</Text>
          <Text style={{ fontSize: 18, fontWeight: 'bold' }}> </Text>
          <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Your Room Reservation</Text>
        </View>

        <FlatList
          data={reservations}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.reservationCard}>
              <Text>Room: {item.room.room}</Text>
              <Text>Time: {item.timeSlot.start} - {item.timeSlot.end}</Text>
              <Text>Type: {item.type}</Text>
            </View>
          )}
          ListEmptyComponent={<Text>You have no reservations.</Text>}
          contentContainerStyle={reservations.length === 0 ? styles.emptyList : null}
        />

        <View style={styles.logoutButton}>
          <Button title="Logout" color="#E64646" onPress={handleLogout} />
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'flex-start',
  },
  reservationCard: {
    padding: 10,
    margin: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    width: 300,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutButton: {
    marginTop: 20,
  },
  emptyList: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
