import ConfirmLogout from "@/components/libraryDialog/comfirmLogout";
import { RenewDialog } from "@/components/libraryDialog/renewDialog";
import BorrowsCard from "@/components/libraryTable/borrowsCard";
import ReservationsCard from "@/components/libraryTable/reservationsCard";
import { Reservations } from "@/utils/api/interfaces/reservations";
import apiClient from "@/utils/api/libraryApi/apiClient";
import { FontAwesome } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
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

export default function Profile() {
  const [profile, setProfile] = useState<{
    username: string;
    email: string;
  } | null>(null);
  const [reservations, setReservations] = useState<Reservations[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const router = useRouter();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loadingTransactions, setLoadingTransactions] = useState(true);

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedTransactionId, setSelectedTransactionId] = useState<
    string | null
  >(null);
  const [showRoomReservation, setShowRoomReservation] = useState(false);
  const [showBorrowedBooks, setShowBorrowedBooks] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const fetchProfileAndReservations = async () => {
    try {
      const profileResponse = await apiClient.get("/users/profile");
      setProfile(profileResponse.data);

      const reservationResponse = await apiClient.get("/reservations/");
      const userReservations = reservationResponse.data.data.filter(
        (res: Reservations) =>
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
      const transactionResponse = await apiClient.get("/transactions/");

      const userTransactions = transactionResponse.data.data.filter(
        (transaction: any) => transaction.user.username === username
      );

      const renewPromises = userTransactions.map(async (transaction: any) => {
        try {
          const renewResponse = await apiClient.get(
            `/renews/?transaction=${transaction.id}`
          );

          if (renewResponse.data.data) {
            return {
              ...transaction,
              renewStatus: renewResponse.data.data.status,
            };
          }
          return { ...transaction, renewStatus: "none" };
        } catch (error) {
          return { ...transaction, renewStatus: "none" };
        }
      });

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
      const response = await apiClient.post("/auth/logout");
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

  const handleOpenConfirmModal = (transactionId: string) => {
    setSelectedTransactionId(transactionId);
    setShowConfirmModal(true);
  };

  const handleConfirmRenew = async () => {
    if (!selectedTransactionId) return;

    try {
      const response = await apiClient.post("/renews/", {
        transaction: selectedTransactionId,
      });
      if (response.status === 200) {
        Alert.alert("Success", "Renew request sent successfully.");
        fetchTransactions(profile?.username || "");
      }
    } catch (error) {
      console.error("Error sending renew request:", error);
      Alert.alert("Error", "Failed to send renew request.");
    } finally {
      setShowConfirmModal(false);
      setSelectedTransactionId(null);
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
            style={{ alignItems: "center", marginBottom: 10, marginTop: 5 }}
          >
            <Image source={require("../assets/images/LibraryMFUprofile.png")} />
          </View>

          <View
            style={{
              alignItems: "center",
              paddingBottom: 5,
              borderBottomWidth: 2,
              borderBottomColor: "gray",
              margin: 10,
            }}
          >
            <Text style={{ fontSize: 15, fontWeight: "bold" }}>
              Student ID: {profile?.username}
            </Text>
            <Text style={{ fontSize: 15, fontWeight: "bold" }}>
              Email: {profile?.email}
            </Text>
          </View>

          {/* Room Reservation Section */}
          <View style={{ margin: 10, alignItems: "center" }}>
            <TouchableOpacity
              onPress={() => setShowRoomReservation(!showRoomReservation)}
              style={{ flexDirection: "row", alignItems: "center" }}
            >
              <Text
                style={{ fontSize: 25, fontWeight: "bold", color: "#000000" }}
              >
                Your Reservations
              </Text>
              <FontAwesome
                name={showRoomReservation ? "caret-up" : "caret-down"}
                size={20}
                color="#000000"
                style={{ marginLeft: 10 }}
              />
            </TouchableOpacity>
            {showRoomReservation && (
              <ReservationsCard reservations={reservations} />
            )}
          </View>

          {/* Borrowed Books Section */}
          <BorrowsCard
            transactions={transactions}
            showBorrowedBooks={showBorrowedBooks}
            toggleBorrowedBooks={() => setShowBorrowedBooks(!showBorrowedBooks)}
            onRenewRequest={handleOpenConfirmModal}
          />
          <RenewDialog
            visible={showConfirmModal}
            onConfirm={handleConfirmRenew}
            onCancel={() => setShowConfirmModal(false)}
          />
        </View>
      </ScrollView>
      <View style={styles.logoutButton}>
        <TouchableOpacity
          onPress={() => setShowLogoutModal(true)} // Show modal
          style={{ alignItems: "center" }}
        >
          <AntDesign name="logout" size={40} color="#BD1616" />
          <Text>Logout</Text>
        </TouchableOpacity>
        <ConfirmLogout
          visible={showLogoutModal}
          onConfirm={() => {
            handleLogout();
            setShowLogoutModal(false);
          }}
          onCancel={() => setShowLogoutModal(false)}
        />
      </View>
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
    alignItems: "flex-start",
    borderColor: "gray",
    borderWidth: 1,
  },
  logoutButton: {
    marginBottom: 30,
  },
  emptyList: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
  },
  transactionCard: {
    padding: 10,
    margin: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    width: 300,
    alignItems: "flex-start",
    borderColor: "gray",
    borderWidth: 1,
  },
  renewButton: {
    backgroundColor: "#BD1616",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: "center",
  },
});
