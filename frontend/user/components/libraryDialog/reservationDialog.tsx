import React from "react";
import { StyleSheet, Text, TouchableOpacity, View, Modal } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Rooms } from "@/utils/api/interfaces/rooms";
import { TimeSlots } from "@/utils/api/interfaces/timeslots";

interface ReservationDialogProps {
  visible: boolean;
  selectedSlot: { roomId: string; timeSlotId: string } | null;
  rooms: Rooms[];
  timeSlots: TimeSlots[];
  onConfirm: () => void;
  onCancel: () => void;
}

const ReservationDialog: React.FC<ReservationDialogProps> = ({
  visible,
  selectedSlot,
  rooms,
  timeSlots,
  onConfirm,
  onCancel,
}) => {
  const selectedRoom = rooms.find((room) => room.id === selectedSlot?.roomId);
  const selectedTimeSlot = timeSlots.find(
    (slot) => slot.id === selectedSlot?.timeSlotId
  );

  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <View style={styles.modalContainer}>
        <View style={styles.modal}>
          {selectedSlot && selectedRoom && selectedTimeSlot && (
            <>
              <Text style={styles.modalTitle}>Confirm Reservation</Text>
              <Text style={styles.modalText}>
                Room: {selectedRoom.type.name.en} {selectedRoom.room}
              </Text>
              <Text style={styles.modalText}>
                Time Slot: {selectedTimeSlot.start} - {selectedTimeSlot.end}
              </Text>
              <View style={styles.modalButtonContainer}>
                <TouchableOpacity
                  onPress={onConfirm}
                  style={styles.confirmButton}
                >
                  <FontAwesome name="check-circle-o" size={25} color="white" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={onCancel}
                  style={styles.cancelButton}
                >
                  <MaterialIcons name="cancel" size={25} color="white" />
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  modal: {
    width: "80%",
    padding: 20,
    backgroundColor: "white",
    borderRadius: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingBottom: 5,
  },
  modalText: {
    fontSize: 16,
    marginVertical: 5,
    color: "#555",
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    width: "80%",
  },
  confirmButton: {
    backgroundColor: "#BD1616",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    alignItems: "center",
    width: "40%",
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: "gray",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    alignItems: "center",
    width: "40%",
    marginHorizontal: 5,
  },
});

export default ReservationDialog;
