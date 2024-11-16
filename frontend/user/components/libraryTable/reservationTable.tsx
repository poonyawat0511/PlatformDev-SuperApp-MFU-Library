import { Rooms } from "@/utils/api/interfaces/rooms";
import { RoomTimeSlots } from "@/utils/api/interfaces/roomtimeslots";
import { TimeSlots } from "@/utils/api/interfaces/timeslots";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

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
    <ScrollView horizontal>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        nestedScrollEnabled={true}
        style={{ flex: 1 }}
      >
        <View style={{ alignItems: "center", marginBottom: 10, marginStart: 6 }}>
          {/* Table Headers */}
          <View style={styles.tableRow}>
            <Text style={styles.headerCell}>Room/Time</Text>
            {timeSlots.map((slot) => (
              <Text key={slot.id} style={styles.headerCell}>
                {slot.start} - {slot.end}
              </Text>
            ))}
          </View>

          {filteredRooms
            .sort((a, b) => a.type.name.en.localeCompare(b.type.name.en))
            .map((room) => (
              <View key={room.id} style={styles.tableRow}>
                <Text style={styles.headerCell}>
                  {room.type.name.en} {room.room}
                </Text>
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
                      <Text style={styles.cellText}>
                        {slot?.status ?? "-"}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ))}
        </View>
      </ScrollView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  tableRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  headerCell: {
    padding: 10,
    backgroundColor: "#F9F4D2",
    width: 120,
    textAlign: "center",
    fontWeight: "bold",
    marginRight: 10,
    borderRadius: 10,
  },
  cell: {
    width: 120,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  cellText: {
    color: "dark",
  },
  freeCell: {
    backgroundColor: "#91C483",
    borderRadius: 10,
  },
  reservedCell: {
    backgroundColor: "#FFE162",
    borderRadius: 10,
  },
  inUseCell: {
    backgroundColor: "#FF6464",
    borderRadius: 10,
  },
  emptyCell: {
    backgroundColor: "#FFE700",
    borderRadius: 10,
    opacity: 0,
  },
});

export default ReservationTable;
