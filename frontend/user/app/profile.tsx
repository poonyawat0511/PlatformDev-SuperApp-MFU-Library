import AntDesign from "@expo/vector-icons/AntDesign";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import axios from "axios";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface Reservation {
  id: string;
  room: { id: string; room: number };
  timeSlot: { id: string; start: string; end: string };
  type: string;
  dateTime: string;
  user: { id: string; username: string };
}

export default function Profile() {
  const [profile, setProfile] = useState<{
    username: string;
    email: string;
  } | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const router = useRouter();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loadingTransactions, setLoadingTransactions] = useState(true);

  const fetchProfileAndReservations = async () => {
    try {
      const profileResponse = await axios.get(
        "http://192.168.1.198:8082/api/users/profile"
      );
      setProfile(profileResponse.data);

      const reservationResponse = await axios.get(
        "http://192.168.1.198:8082/api/reservations/"
      );
      const userReservations = reservationResponse.data.data.filter(
        (res: Reservation) =>
          res.user.username === profileResponse.data.username
      );
      setReservations(userReservations);
      await fetchTransactions(profileResponse.data.username);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async (username: string) => {
    try {
      const transactionResponse = await axios.get(
        "http://192.168.1.198:8082/api/transactions/"
      );

      // Filter transactions by username
      const userTransactions = transactionResponse.data.data.filter(
        (transaction: any) => transaction.user.username === username
      );

      // Fetch renew status for each transaction
      const renewPromises = userTransactions.map(async (transaction: any) => {
        try {
          // Fetch renew status for each transaction
          const renewResponse = await axios.get(
            `http://192.168.1.198:8082/api/renews/?transaction=${transaction.id}`
          );

          // If renew request exists (status 200)
          if (renewResponse.data.data) {
            return {
              ...transaction,
              renewStatus: renewResponse.data.data.status,
            }; // Return transaction with its renewStatus
          }
          return { ...transaction, renewStatus: "none" };
        } catch (error) {
          // Handle 404 error, meaning no renew request exists for this transaction
          return { ...transaction, renewStatus: "none" }; // No renews found, return 'none'
        }
      });

      // Wait for all renew status promises to resolve
      const transactionsWithRenewStatus = await Promise.all(renewPromises);
      setTransactions(transactionsWithRenewStatus);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoadingTransactions(false);
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
      const response = await axios.post(
        "http://192.168.1.198:8082/api/auth/logout"
      );
      if (response.data.message === "Logout successful") {
        Alert.alert("Success", "You have logged out successfully.", [
          { text: "OK", onPress: () => router.push("./login") },
        ]);
      }
    } catch (error) {
      console.error("Error logging out:", error);
      Alert.alert("Error", "Logout failed. Please try again.");
    }
  };

  const handleRenew = async (transactionId: string) => {
    try {
      const response = await axios.post(
        "http://192.168.1.198:8082/api/renews/",
        { transaction: transactionId }
      );
      if (response.status === 200) {
        Alert.alert("Success", "Renew request sent successfully.");
        fetchTransactions(profile?.username || ""); // Reload transactions
      }
    } catch (error) {
      console.error("Error sending renew request:", error);
      Alert.alert("Error", "Failed to send renew request.");
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  return (
    <ImageBackground
      imageStyle={{ backgroundColor: "#FFFFFF" }}
      style={styles.background}
    >
      <ScrollView>
        <View style={styles.container}>
          <View
            style={{ alignItems: "center", marginBottom: 10, marginTop: 20 }}
          >
            <Image source={require("../assets/images/LibraryMFUprofile.png")} />
          </View>

          <View
            style={{
              alignItems: "flex-start",
              paddingBottom: 5,
              borderBottomWidth: 2,
              borderBottomColor: "gray",
              margin: 10,
            }}
          >
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>
              Student ID: {profile?.username}
            </Text>
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>
              Email: {profile?.email}
            </Text>
          </View>

          <View
            style={{
              alignItems: "center",
              padding: 20,
              backgroundColor: "#BD1616",
              borderRadius: 15,
              margin: 10,
            }}
          >
            <Text
              style={{
                fontSize: 25,
                fontWeight: "bold",
                color: "#FFFFFF",
                borderBottomColor: "#FFFFFF",
                paddingBottom: 4,
                borderBottomWidth: 2,
              }}
            >
              Your Room Reservation
            </Text>
            {reservations.map((item) => (
              <View key={item.id} style={styles.reservationCard}>
                <Text>Room: {item.room.room}</Text>
                <Text>
                  Time: {item.timeSlot.start} - {item.timeSlot.end}
                </Text>
                <Text>Type: {item.type}</Text>
              </View>
            ))}
          </View>

          <View
            style={{
              alignItems: "center",
              padding: 20,
              backgroundColor: "#BD1616",
              borderRadius: 15,
              margin: 10,
            }}
          >
            {transactions.length > 0 && (
              <>
                <Text
                  style={{
                    fontSize: 25,
                    fontWeight: "bold",
                    color: "#FFFFFF",
                    borderBottomColor: "#FFFFFF",
                    paddingBottom: 4,
                    borderBottomWidth: 2,
                  }}
                >
                  Borrowed Books
                </Text>
                {transactions.map((item) => (
                  <View key={item.id} style={styles.transactionCard}>
                    <Text>Book: {item.book.name.en}</Text>
                    <Text>
                      Borrow Date:{" "}
                      {new Date(item.borrowDate).toLocaleDateString()}
                    </Text>
                    <Text>
                      Due Date: {new Date(item.dueDate).toLocaleDateString()}
                    </Text>
                  </View>
                ))}
              </>
            )}
          </View>

          <View style={styles.logoutButton}>
            <TouchableOpacity
              onPress={handleLogout}
              style={{ alignItems: "center" }}
            >
              <AntDesign name="logout" size={40} color="black" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  reservationCard: {
    padding: 10,
    margin: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    width: 300,
    alignItems: "center",
    justifyContent: "center",
  },
  logoutButton: {
    marginTop: 20,
  },
  emptyList: {
    flexGrow: 0.3,
    justifyContent: "center",
    alignItems: "center",
  },
  transactionCard: {
    padding: 10,
    margin: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    width: 300,
    alignItems: "center",
    justifyContent: "center",
  },
  bookImage: {
    width: 100,
    height: 150,
    marginBottom: 10,
  },
});
