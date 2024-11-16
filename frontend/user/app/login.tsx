import apiClient from "@/utils/api/libraryApi/apiClient";
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
  ActivityIndicator,
} from "react-native";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Validation Error", "Please fill in both fields.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiClient.post("/auth/login", { email, password });
      if (response.data.message === "Login successful") {
        Alert.alert("Login successful");
        router.push("./main");
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const errorMessage = error.response.data.message || "Login failed";
        Alert.alert("Login failed", errorMessage);
      } else {
        Alert.alert("Login failed", "An unexpected error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!email || !password || !username) {
      Alert.alert("Validation Error", "Please fill in all fields.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiClient.post("/users/register", {
        email,
        password,
        username,
      });
      if (response.data.message === "Register successful") {
        Alert.alert("Success", "You have registered successfully.");
        setIsLoginMode(true);
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const errorMessage =
          error.response.data.message || "Registration failed";
        Alert.alert("Register failed", errorMessage);
      } else {
        Alert.alert("Register failed", "An unexpected error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require("../assets/images/LibraryMFUBG.png")}
      imageStyle={{ opacity: 0.5 }}
      style={styles.background}
    >
      <View style={styles.container}>
        <View style={styles.formContainer}>
          <View style={styles.logoContainer}>
            <Image
              source={require("../assets/images/LibraryMFUsmalllogo.png")}
              style={styles.logo}
            />
          </View>
          {isLoginMode ? (
            <>
              <Text style={styles.title}>Login</Text>
              <TextInput
                style={styles.input}
                placeholder="Email"
                onChangeText={setEmail}
                value={email}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor="white"
              />
              <TextInput
                style={styles.input}
                placeholder="Password"
                onChangeText={setPassword}
                value={password}
                secureTextEntry
                placeholderTextColor="white"
              />
              <TouchableOpacity onPress={handleLogin} style={styles.button}>
                {isLoading ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <>
                    <AntDesign name="login" size={24} color="white" />
                    <Text style={styles.buttonText}>Login</Text>
                  </>
                )}
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text style={styles.title}>Register</Text>
              <TextInput
                style={styles.input}
                placeholder="Username"
                onChangeText={setUsername}
                value={username}
              />
              <TextInput
                style={styles.input}
                placeholder="Email"
                onChangeText={setEmail}
                value={email}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <TextInput
                style={styles.input}
                placeholder="Password"
                onChangeText={setPassword}
                value={password}
                secureTextEntry
                placeholderTextColor="white"
              />
              <TouchableOpacity onPress={handleRegister} style={styles.button}>
                {isLoading ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <>
                    <AntDesign name="adduser" size={24} color="white" />
                    <Text style={styles.buttonText}>Register</Text>
                  </>
                )}
              </TouchableOpacity>
            </>
          )}

          {/* Toggle Button */}
          <TouchableOpacity
            onPress={() => setIsLoginMode((prevMode) => !prevMode)}
            style={styles.toggleButton}
          >
            <Text style={styles.toggleButtonText}>
              {isLoginMode
                ? "Don't have an account? Register"
                : "Already have an account? Login"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  logo: {
    width: 150,
    height: 100,
    resizeMode: "contain",
  },
  background: {
    flex: 1,
    resizeMode: "cover",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  logoContainer: {
    alignItems: "center",
  },
  formContainer: {
    backgroundColor: "rgba(0, 0, 0, 0)",
    padding: 20,
  },
  title: {
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 24,
    paddingBottom: 20,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 20,
    borderRadius: 20,
    paddingHorizontal: 10,
    textAlign: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    color:"white"
  },
  button: {
    backgroundColor: "#000000",
    padding: 10,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    marginLeft: 5,
  },
  toggleButton: {
    marginTop: 20,
    alignItems: "center",
  },
  toggleButtonText: {
    color: "#000000",
    textDecorationLine: "underline",
  },
});
