import ReservationDialog from "@/components/libraryDialog/reservationDialog";
import ReservationTable from "@/components/libraryTable/reservationTable";
import { Rooms } from "@/utils/api/interfaces/rooms";
import { RoomTimeSlots } from "@/utils/api/interfaces/roomtimeslots";
import { TimeSlots } from "@/utils/api/interfaces/timeslots";
import apiClient from "@/utils/api/libraryApi/apiClient";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function RoomReservation() {
  const [timeSlots, setTimeSlots] = useState<TimeSlots[]>([]);
  const [rooms, setRooms] = useState<Rooms[]>([]);
  const [roomTimeSlots, setRoomTimeSlots] = useState<RoomTimeSlots[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<{
    roomId: string;
    timeSlotId: string;
  } | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [user, setUser] = useState<{ username: string } | null>(null);
  const [refresh, setRefresh] = useState(false);
  const [selectedFloor, setSelectedFloor] = useState<number | null>(null);

  const fetchTimeSlots = async () => {
    const response = await apiClient.get("/timeslots/");
    setTimeSlots(response.data.data);
  };

  const fetchRooms = async () => {
    const response = await apiClient.get("/rooms/");
    setRooms(response.data.data);
  };

  const fetchRoomTimeSlots = async () => {
    const response = await apiClient.get("/room-timeslots/");
    setRoomTimeSlots(response.data.data);
  };

  const fetchUser = async () => {
    const response = await apiClient.get("/users/profile");
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

  const handleCellClick = (room: Rooms, timeSlot: TimeSlots) => {
    if (!room || !timeSlot || !roomTimeSlots) return;

    const slot = roomTimeSlots.find(
      (rts) => rts.room?.id === room.id && rts.timeSlot?.id === timeSlot.id
    );

    if (slot?.status === "free") {
      setSelectedSlot({ roomId: room.id, timeSlotId: timeSlot.id });
      setModalVisible(true);
    }
  };

  const handleReservation = async () => {
    if (selectedSlot && user) {
      try {
        await apiClient.post("/reservations/", {
          room: selectedSlot.roomId,
          user: user.username,
          type: "pending",
          timeSlot: selectedSlot.timeSlotId,
        });
        Alert.alert("Reservation successful");
        setModalVisible(false);
        setRefresh(!refresh);
      } catch (error) {
        console.error("Reservation failed:", error);
        Alert.alert("Reservation failed");
      }
    }
  };

  const handleCancel = () => {
    setModalVisible(false);
    setRefresh(!refresh);
  };

  const handleFilterByFloor = (floor: number | null) => {
    setSelectedFloor(floor);
  };

  const filteredRooms = selectedFloor
    ? rooms.filter((room) => room.floor === selectedFloor)
    : rooms;

  const floors = Array.from(new Set(rooms.map((room) => room.floor)));

  return (
    <ImageBackground
      imageStyle={{ backgroundColor: "#FFFFFF" }}
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
        <Text style={{ fontSize: 35, fontWeight: "bold", paddingTop: 10 }}>
          Room Reservation
        </Text>
      </View>

      <View style={{ flex: 1 }}>
        <View style={{ alignItems: "center", marginBottom: 10, marginTop: 10 }}>
          <Image
            source={require("../assets/images/LibraryMFURoomRuleBanner.png")}
            style={{
              width: "95%",
              height: 200,
              resizeMode: "contain",
              borderWidth: 2,
              borderColor: "gray",
              borderRadius: 15,
              backgroundColor: "#FBF6E2",
            }}
          />
        </View>
        <View>
          {/* Floor Filter Buttons */}
          <ScrollView horizontal>
            <View style={styles.floorFilterContainer}>
              <TouchableOpacity
                onPress={() => handleFilterByFloor(null)}
                style={[
                  styles.floorButton,
                  selectedFloor === null && styles.selectedFloorButton,
                ]}
              >
                <Text>All Floors</Text>
              </TouchableOpacity>
              {floors.map((floor) => (
                <TouchableOpacity
                  key={floor}
                  onPress={() => handleFilterByFloor(floor)}
                  style={[
                    styles.floorButton,
                    selectedFloor === floor && styles.selectedFloorButton,
                  ]}
                >
                  <Text>Floor {floor}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
        <View>
          <Text>
            <ReservationTable
              timeSlots={timeSlots}
              rooms={rooms}
              roomTimeSlots={roomTimeSlots}
              selectedFloor={selectedFloor}
              handleCellClick={handleCellClick}
            />
            ;
          </Text>
        </View>
        <ReservationDialog
          visible={modalVisible}
          selectedSlot={selectedSlot}
          rooms={rooms}
          timeSlots={timeSlots}
          onConfirm={handleReservation}
          onCancel={handleCancel}
        />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  floorFilterContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginVertical: 10,
  },
  floorButton: {
    padding: 10,
    marginHorizontal: 5,
    backgroundColor: "#F0F0F0",
    borderRadius: 5,
    flexShrink: 0,
    minWidth: 120,
    alignItems: "center",
  },
  selectedFloorButton: {
    backgroundColor: "#CCC",
  },
  background: { flex: 1 },
});
