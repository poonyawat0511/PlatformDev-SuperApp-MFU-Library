import AntDesign from "@expo/vector-icons/AntDesign";
import axios from "axios";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        "http://172.27.72.20:8082/api/auth/login",
        {
          email,
          password,
        }
      );

      if (response.data.message === "Login successful") {
        // Navigate to the profile screen if login is successful
        router.push("./main");
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        // Error response from server
        const errorMessage = error.response.data.message || "Login failed";
        Alert.alert("Login failed", errorMessage);
      } else {
        // Network or other errors
        Alert.alert("Login failed", "An unexpected error occurred.");
      }
    }
  };

  return (
    <ImageBackground
      source={require("../assets/images/LibraryMFUBG.png")}
      imageStyle={{ opacity: 0.5 }}
      style={styles.background}
    >
      <View style={{ flex: 1, justifyContent: "center", padding: 15 }}>
        <View style={{ alignItems: "center", marginBottom: 40, marginTop: 10 }}>
          <Image source={require("../assets/images/LibraryMFUsmalllogo.png")} />
        </View>

        <View
          style={{
            backgroundColor: "#FEF9F2",
            marginRight: 10,
            borderRadius: 20,
            height: "auto",
            width: "auto",
            padding: 20,
          }}
        >
          <Text
            style={{
              fontWeight: "bold",
              textAlign: "center",
              fontSize: 20,
              padding: 10,
            }}
          >
            Email
          </Text>
          <TextInput
            style={{
              height: 40,
              borderColor: "gray",
              borderWidth: 1,
              marginBottom: 20,
              borderRadius: 20,
              textAlign: "center",
            }}
            onChangeText={setEmail}
            value={email}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Text
            style={{
              fontWeight: "bold",
              textAlign: "center",
              fontSize: 20,
              padding: 10,
            }}
          >
            Password
          </Text>
          <TextInput
            style={{
              height: 40,
              borderColor: "gray",
              borderWidth: 1,
              marginBottom: 10,
              borderRadius: 20,
              textAlign: "center",
            }}
            onChangeText={setPassword}
            value={password}
            secureTextEntry
          />
          <View style={{ alignItems: "center" }}>
            <TouchableOpacity onPress={handleLogin}>
              <AntDesign name="login" size={40} color="black" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
  },
});
