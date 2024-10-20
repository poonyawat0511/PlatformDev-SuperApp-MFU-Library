import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
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
    <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
      <Text>Email:</Text>
      <TextInput
        style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 20 }}
        onChangeText={setEmail}
        value={email}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <Text>Password:</Text>
      <TextInput
        style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 20 }}
        onChangeText={setPassword}
        value={password}
        secureTextEntry
      />
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
}