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
  Modal,
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

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedTransactionId, setSelectedTransactionId] = useState<
    string | null
  >(null);

  const fetchProfileAndReservations = async () => {
    try {
      const profileResponse = await axios.get(
        "http://172.20.10.11:8082/api/users/profile"
      );
      setProfile(profileResponse.data);

      const reservationResponse = await axios.get(
        "http://172.20.10.11:8082/api/reservations/"
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
        "http://172.20.10.11:8082/api/transactions/"
      );

      const userTransactions = transactionResponse.data.data.filter(
        (transaction: any) => transaction.user.username === username
      );

      const renewPromises = userTransactions.map(async (transaction: any) => {
        try {
          const renewResponse = await axios.get(
            `http://172.20.10.11:8082/api/renews/?transaction=${transaction.id}`
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
      const response = await axios.post(
        "http://172.20.10.11:8082/api/auth/logout"
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

  const handleOpenConfirmModal = (transactionId: string) => {
    setSelectedTransactionId(transactionId);
    setShowConfirmModal(true);
  };

  const handleConfirmRenew = async () => {
    if (!selectedTransactionId) return;

    try {
      const response = await axios.post(
        "http://172.20.10.11:8082/api/renews/",
        { transaction: selectedTransactionId }
      );
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
                <Text>
                  <Text style={{ fontWeight: "bold" }}>
                    Room: {item?.room?.room||"-"}
                  </Text>
                </Text>
                <Text style={{ justifyContent: "space-between" }}>
                  <Text>
                    Time: {item?.timeSlot?.start||"-"} - {item?.timeSlot?.end||"-"}
                  </Text>
                  <Text
                    style={{
                      color:
                        item?.type === "confirmed"
                          ? "green"
                          : item?.type === "pending"
                          ? "yellow"
                          : "red",
                    }}
                  >
                    {" "}
                    : {item?.type||"-"}
                  </Text>
                </Text>
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
                    <Text style={{ fontWeight: "bold" }}>
                      Book: {item?.book?.name?.en||"-"}
                    </Text>
                    <Text>
                      Borrow Date:{" "}
                      {new Date(item?.borrowDate||"-").toLocaleDateString()}
                    </Text>
                    <Text>
                      Due Date: {new Date(item?.dueDate||"-").toLocaleDateString()}
                    </Text>
                    <TouchableOpacity
                      onPress={() => handleOpenConfirmModal(item.id)}
                      style={styles.renewButton}
                    >
                      <Text style={{ color: "#fff", fontWeight: "bold" }}>
                        Renew
                      </Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </>
            )}
          </View>

          <Modal
            transparent={true}
            visible={showConfirmModal}
            animationType="fade"
            onRequestClose={() => setShowConfirmModal(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContainer}>
                <Text style={styles.modalTitle}>Confirm Renewal</Text>
                <Text>Are you sure you want to renew this book?</Text>
                <View style={styles.modalButtonContainer}>
                  <TouchableOpacity
                    style={styles.confirmButton}
                    onPress={handleConfirmRenew}
                  >
                    <Text style={{ color: "#fff" }}>Confirm</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => setShowConfirmModal(false)}
                  >
                    <Text style={{ color: "#fff" }}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>

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
    alignItems: "flex-start",
  },
  logoutButton: {
    marginTop: 20,
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
  },
  renewButton: {
    backgroundColor: "#BD1616",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: "center",
  }, modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalButtonContainer: {
    flexDirection: "row",
    marginTop: 20,
  },
  cancelButton: {
    backgroundColor: "gray",
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  confirmButton: {
    backgroundColor: "#BD1616",
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 10,
  },
});