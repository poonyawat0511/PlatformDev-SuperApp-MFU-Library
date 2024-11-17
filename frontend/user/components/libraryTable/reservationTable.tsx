import React from "react";
import { StyleSheet, Text, TouchableOpacity, View, ScrollView } from "react-native";
import { Rooms } from "@/utils/api/interfaces/rooms";
import { RoomTimeSlots } from "@/utils/api/interfaces/roomtimeslots";
import { TimeSlots } from "@/utils/api/interfaces/timeslots";

interface ReservationTableProps {
  timeSlots: TimeSlots[];
  rooms: Rooms[];
  roomTimeSlots: RoomTimeSlots[];
  selectedFloor: number | null;
  handleCellClick: (room: Rooms, timeSlot: TimeSlots) => void;
}

const ReservationTable: React.FC<ReservationTableProps> = ({
  timeSlots,
  rooms,
  roomTimeSlots,
  selectedFloor,
  handleCellClick,
}) => {
  const filteredRooms = selectedFloor
    ? rooms.filter((room) => room.floor === selectedFloor)
    : rooms;

  return (
    <ScrollView style={styles.container}>
      {filteredRooms
        .sort((a, b) => a.type.name.en.localeCompare(b.type.name.en))
        .map((room) => (
          <View key={room.id} style={styles.card}>
            <Text style={styles.roomTitle}>
              {room.type.name.en} {room.room}
            </Text>
            <ScrollView horizontal style={styles.timeSlotsContainer}>
              {timeSlots.map((timeSlot) => {
                const slot = roomTimeSlots.find(
                  (rts) =>
                    rts.room?.id === room.id &&
                    rts.timeSlot?.id === timeSlot.id
                );

                return (
                  <TouchableOpacity
                    key={timeSlot.id}
                    style={[
                      styles.timeSlot,
                      slot
                        ? slot.status === "free"
                          ? styles.freeSlot
                          : slot.status === "reserved"
                          ? styles.reservedSlot
                          : styles.inUseSlot
                        : styles.emptySlot,
                    ]}
                    onPress={() => handleCellClick(room, timeSlot)}
                  >
                    <Text style={styles.timeSlotText}>
                      {timeSlot.start} - {timeSlot.end}
                    </Text>
                    <Text style={styles.statusText}>
                      {slot?.status ?? "Unavailable"}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 15,
    marginBottom: 15,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  roomTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  timeSlotsContainer: {
    flexDirection: "row",
  },
  timeSlot: {
    width: 120,
    padding: 10,
    borderRadius: 8,
    marginRight: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  timeSlotText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  statusText: {
    fontSize: 12,
    marginTop: 5,
  },
  freeSlot: {
    backgroundColor: "#F0F0F0",
    borderRadius: 20,
  },
  reservedSlot: {
    backgroundColor: "#9F9F9E",
    borderRadius: 20,
  },
  inUseSlot: {
    backgroundColor: "#FFD663",
    borderRadius: 20,
  },
  emptySlot: {
    backgroundColor: "#FED91",
    borderRadius: 20,
  },
});

export default ReservationTable;
