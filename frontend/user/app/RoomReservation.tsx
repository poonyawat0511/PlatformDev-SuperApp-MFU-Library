import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import {
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

interface TimeSlot {
  id: string;
  start: string;
  end: string;
}

interface Room {
  id: string;
  room: number;
  type: {
    name: {
      th: string;
      en: string;
    };
  };
}

interface RoomTimeSlot {
  room: Room;
  timeSlot: TimeSlot;
  status: "free" | "reserved" | "in use";
}

export default function RoomReservation() {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [roomTimeSlots, setRoomTimeSlots] = useState<RoomTimeSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<{
    roomId: string;
    timeSlotId: string;
  } | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [user, setUser] = useState<{ username: string } | null>(null);
  const [refresh, setRefresh] = useState(false);

  const fetchTimeSlots = async () => {
    const response = await axios.get("http://172.25.208.1:8082/api/timeslots/");
    setTimeSlots(response.data.data);
  };

  const fetchRooms = async () => {
    const response = await axios.get("http://172.25.208.1:8082/api/rooms/");
    setRooms(response.data.data);
  };

  const fetchRoomTimeSlots = async () => {
    const response = await axios.get(
      "http://172.25.208.1:8082/api/room-timeslots/"
    );
    setRoomTimeSlots(response.data.data);
  };

  const fetchUser = async () => {
    const response = await axios.get(
      "http://172.25.208.1:8082/api/users/profile"
    );
    setUser(response.data);
  };

  useEffect(() => {
    fetchTimeSlots();
    fetchRooms();
    fetchRoomTimeSlots();
    fetchUser();
  }, [refresh]);

  useFocusEffect(
    useCallback(() => {
      fetchTimeSlots();
      fetchRooms();
      fetchRoomTimeSlots();
      fetchUser();
    }, [])
  );

  const handleCellClick = (room: Room, timeSlot: TimeSlot) => {
    const slot = roomTimeSlots.find(
      (rts) => rts.room.id === room.id && rts.timeSlot.id === timeSlot.id
    );

    if (slot?.status === "free") {
      setSelectedSlot({ roomId: room.id, timeSlotId: timeSlot.id });
      setModalVisible(true); // Show confirmation modal
    }
  };

  const handleReservation = async () => {
    if (selectedSlot && user) {
      try {
        await axios.post("http://172.25.208.1:8082/api/reservations/", {
          room: selectedSlot.roomId,
          user: user.username,
          type: "pending",
          timeSlot: selectedSlot.timeSlotId,
        });
        Alert.alert("Reservation successful");
        setModalVisible(false); // Close the modal
        setRefresh(!refresh); // Trigger data refresh
      } catch (error) {
        console.error("Reservation failed:", error);
        Alert.alert("Reservation failed");
      }
    }
  };

  const handleCancel = () => {
    setModalVisible(false); // Close the modal
    setRefresh(!refresh); // Trigger data refresh
  };

  return (
    <ImageBackground
      imageStyle={{ backgroundColor: "#F7F9F2" }}
      style={styles.background}
    >
      <View
        style={{
          alignItems: "flex-start",
          marginLeft: 10,
          marginRight: 10,
          borderBottomColor: "gray",
          paddingBottom: 4,
          borderBottomWidth: 2,
        }}
      >
        <Text style={{ fontSize: 25, fontWeight: "bold", paddingTop: 10 }}>
          Room Reservation
        </Text>
      </View>

      <View>
        {/* Text and Image Above Table */}
        <View style={{ alignItems: "center", marginBottom: 10, marginTop: 10 }}>
          <Image
            source={require("../assets/images/LibraryMFURoomRuleBanner.png")}
            style={{
              width: "95%",
              height: 200,
              resizeMode: "contain",
              borderWidth: 1,
              borderColor: "gray",
              borderRadius: 20,
            }}
          />
        </View>

        <ScrollView horizontal>
          <View
            style={{ alignItems: "center", marginBottom: 10, marginTop: 20 }}
          >
            {/* Table Headers */}
            <View style={styles.tableRow}>
              <Text style={styles.headerCell}>Room/Time</Text>
              {timeSlots.map((slot) => (
                <Text key={slot.id} style={styles.headerCell}>
                  {slot.start} - {slot.end}
                </Text>
              ))}
            </View>

            {/* Table Content */}
            {rooms
              .sort((a, b) => a.type.name.en.localeCompare(b.type.name.en)) // Sort rooms by name
              .map((room) => (
                <View key={room.id} style={styles.tableRow}>
                  <Text style={styles.headerCell}>
                    {room.type.name.en} {room.room}
                  </Text>
                  {timeSlots.map((timeSlot) => {
                    const slot = roomTimeSlots.find(
                      (rts) =>
                        rts.room.id === room.id &&
                        rts.timeSlot.id === timeSlot.id
                    );

                    return (
                      <TouchableOpacity
                        key={timeSlot.id}
                        style={[
                          styles.cell,
                          slot
                            ? slot.status === "free"
                              ? styles.freeCell
                              : slot.status === "reserved"
                              ? styles.reservedCell
                              : styles.inUseCell
                            : styles.emptyCell,
                        ]}
                        onPress={() => handleCellClick(room, timeSlot)}
                      >
                        <Text style={styles.cellText}>{slot?.status}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              ))}

            {/* Confirmation Modal */}
            <Modal
              visible={modalVisible}
              transparent={true}
              animationType="slide"
            >
              <View style={styles.modalContainer}>
                <View style={styles.modal}>
                  {selectedSlot && (
                    <>
                      <Text
                        style={{
                          fontSize: 22,
                          fontWeight: "bold",
                          paddingBottom: 5,
                          borderBottomWidth: 2,
                          borderBottomColor: "gray",
                        }}
                      >
                        Confirm Reservation
                      </Text>
                      {/* Find the selected room and time slot details */}
                      <Text style={{ fontSize: 17,}}>
                        Room:{" "}
                        {
                          rooms.find((room) => room.id === selectedSlot.roomId)
                            ?.type.name.en
                        }{" "}
                        {
                          rooms.find((room) => room.id === selectedSlot.roomId)
                            ?.room
                        }
                      </Text>
                      <Text style={{ fontSize: 17,  }}>
                        Time Slot:{" "}
                        {
                          timeSlots.find(
                            (slot) => slot.id === selectedSlot.timeSlotId
                          )?.start
                        }{" "}
                        -{" "}
                        {
                          timeSlots.find(
                            (slot) => slot.id === selectedSlot.timeSlotId
                          )?.end
                        }
                      </Text>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginTop:20
                        }}
                      >
                        <TouchableOpacity
                          onPress={handleReservation}
                          style={styles.modalButton}
                        >
                          <FontAwesome
                            name="check-circle-o"
                            size={35}
                            color="black"
                          />
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={handleCancel}
                          style={styles.modalButton}
                        >
                          <MaterialIcons
                            name="cancel"
                            size={35}
                            color="black"
                          />
                        </TouchableOpacity>
                      </View>
                    </>
                  )}
                </View>
              </View>
            </Modal>
          </View>
        </ScrollView>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  tableRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerCell: {
    padding: 10,
    backgroundColor: "#E3E1E1",
    width: 120, // Fixed width to match the content cells
    textAlign: "center",
    fontWeight: "bold",
  },
  cell: {
    width: 120, // Fixed width to match the headers
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  cellText: {
    color: "dark",
  },
  freeCell: {
    backgroundColor: "#B6FFA1",
  },
  reservedCell: {
    backgroundColor: "#F0EAAC",
  },
  inUseCell: {
    backgroundColor: "#FF8A8A",
  },
  emptyCell: {
    backgroundColor: "#FFE700",
    opacity: 0,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modal: {
    width: "auto",
    height: "auto",
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  background: { flex: 1 },
  modalButton: {
    justifyContent: "space-between",
    paddingTop: 5,
  },
});
