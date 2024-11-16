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
  const [username, setUsername] = useState("");
  const router = useRouter();
  const [isLoginMode, setIsLoginMode] = useState(true);

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        "http://172.27.66.240:8082/api/auth/login",
        {
          email,
          password,
        }
      );

      if (response.data.message === "Login successful") {
        Alert.alert("Login successfully")
        router.push("./main");
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const errorMessage = error.response.data.message || "Login failed";
        Alert.alert("Login failed", errorMessage);
      } else {
        Alert.alert("Login failed", "An unexpected error occurred.");
      }
    }
  };

  const handleRegister = async () => {
    try {
      const response = await axios.post(
        "http://172.27.66.240:8082/api/users/register",
        {
          email,
          password,
          username,
        }
      );

      if (response.data.message === "Register successful") {
        Alert.alert("Success", "You have register successfully."),
          setIsLoginMode(true);
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const errorMessage = error.response.data.message || "Register failed";
        Alert.alert("Register failed", errorMessage);
      } else {
        Alert.alert("Register failed", "An unexpected error occurred.");
      }
    }
  };

  return (
    <ImageBackground
      source={require("../assets/images/LibraryMFUBG.png")}
      imageStyle={{ opacity: 0.5 }}
      style={styles.background}
    >
      <View style={{ flex: 1, justifyContent: "center", padding: 10 }}>
        <View style={{ alignItems: "center", marginBottom: 20 }}>
          <Image source={require("../assets/images/LibraryMFUsmalllogo.png")} />
        </View>

        <View
          style={{
            backgroundColor: "#FEF9F2",
            borderRadius: 20,
            padding: 20,
          }}
        >
          {isLoginMode ? (
            // Login Form
            <>
              <Text style={styles.title}>Login</Text>
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
              />
              <TouchableOpacity onPress={handleLogin} style={styles.button}>
                <AntDesign name="login" size={24} color="white" />
                <Text style={styles.buttonText}>Login</Text>
              </TouchableOpacity>
            </>
          ) : (
            // Register Form
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
              />
              <TouchableOpacity onPress={handleRegister} style={styles.button}>
                <AntDesign name="adduser" size={24} color="white" />
                <Text style={styles.buttonText}>Register</Text>
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
  background: {
    flex: 1,
    resizeMode: "cover",
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
  },
  button: {
    backgroundColor: "#007AFF",
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
    color: "#007AFF",
    textDecorationLine: "underline",
  },
});
