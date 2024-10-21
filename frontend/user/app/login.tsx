import React, { useState } from 'react';
import { View, Text, Image, ImageBackground, StyleSheet, TextInput, Button, Alert } from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://192.168.1.37:8082/api/auth/login', {
        email,
        password,
      });

      if (response.data.message === 'Login successful') {
        // Navigate to the profile screen if login is successful
        router.push('./main');
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        // Error response from server
        const errorMessage = error.response.data.message || 'Login failed';
        Alert.alert('Login failed', errorMessage);
      } else {
        // Network or other errors
        Alert.alert('Login failed', 'An unexpected error occurred.');
      }
    }
  };


  return (
    <ImageBackground
      source={require('../assets/images/LibraryMFUBG.png')}
      imageStyle={{ opacity: 0.5 }}
      style={styles.background}
    >


      <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
        <View style={{ alignItems: 'center', marginBottom: 10, marginTop: 20 }}>
          <Image source={require('../assets/images/LibraryMFUsmalllogo.png')} />
        </View>

        <View style={{
          backgroundColor: 'white', opacity: 1, marginBottom: 10, marginTop: 20, marginLeft: 10, marginRight: 10, borderWidth: 5, borderTopLeftRadius: 20,
          borderTopRightRadius: 20, borderBottomLeftRadius: 20,
          borderBottomRightRadius: 20, borderColor: 'white'
        }}>
          <Text>Email:</Text>
          <TextInput
            style={{ height: 40, borderColor: 'gray', borderWidth: 3, marginBottom: 20 }}
            onChangeText={setEmail}
            value={email}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Text>Password:</Text>
          <TextInput
            style={{ height: 40, borderColor: 'gray', borderWidth: 3, marginBottom: 10 }}
            onChangeText={setPassword}
            value={password}
            secureTextEntry
          />
        </View>

        <View style={{ flex: 0.3, justifyContent: 'center', alignItems: 'center', }}>
          <Button title="Login" color="#E64646" onPress={handleLogin} />
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
});