import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, Modal, Button, Alert } from 'react-native';
import axios from 'axios';

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
  status: 'free' | 'reserved' | 'in use';
}

export default function RoomReservation() {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [roomTimeSlots, setRoomTimeSlots] = useState<RoomTimeSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<{ roomId: string; timeSlotId: string } | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [user, setUser] = useState<{ username: string } | null>(null);
  const [refresh, setRefresh] = useState(false); // State to trigger data refresh

  // Fetch data on mount and when refresh changes
  useEffect(() => {
    const fetchTimeSlots = async () => {
      const response = await axios.get('http://192.168.1.37:8082/api/timeslots/');
      setTimeSlots(response.data.data);
    };

    const fetchRooms = async () => {
      const response = await axios.get('http://192.168.1.37:8082/api/rooms/');
      setRooms(response.data.data);
    };

    const fetchRoomTimeSlots = async () => {
      const response = await axios.get('http://192.168.1.37:8082/api/room-timeslots/');
      setRoomTimeSlots(response.data.data);
    };

    const fetchUser = async () => {
      const response = await axios.get('http://192.168.1.37:8082/api/users/profile');
      setUser(response.data);
    };

    fetchTimeSlots();
    fetchRooms();
    fetchRoomTimeSlots();
    fetchUser();
  }, [refresh]); // Trigger re-fetch when refresh state changes

  const handleCellClick = (room: Room, timeSlot: TimeSlot) => {
    const slot = roomTimeSlots.find(
      (rts) => rts.room.id === room.id && rts.timeSlot.id === timeSlot.id
    );

    if (slot?.status === 'free') {
      setSelectedSlot({ roomId: room.id, timeSlotId: timeSlot.id });
      setModalVisible(true); // Show confirmation modal
    }
  };

  const handleReservation = async () => {
    if (selectedSlot && user) {
      try {
        await axios.post('http://192.168.1.37:8082/api/reservations/', {
          room: selectedSlot.roomId,
          user: user.username,
          type: 'pending',
          timeSlot: selectedSlot.timeSlotId,
        });
        Alert.alert('Reservation successful');
        setModalVisible(false); // Close the modal
        setRefresh(!refresh); // Trigger data refresh
      } catch (error) {
        console.error('Reservation failed:', error);
        Alert.alert('Reservation failed');
      }
    }
  };

  const handleCancel = () => {
    setModalVisible(false); // Close the modal
    setRefresh(!refresh); // Trigger data refresh
  };

  return (
    <View>
      {/* Text and Image Above Table */}
      <View style={{ alignItems: 'center', marginBottom: 10, marginTop: 20 }}>
        <Image source={require('../assets/images/RoomRuleBanner.png')} style={{ width: 350, height: 100 }} />
      </View>
      <View style={{ alignItems: 'center', marginBottom: 10, marginTop: 20 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Room Reservation</Text>
      </View>
      <ScrollView horizontal>
        <View style={{ alignItems: 'center', marginBottom: 10, marginTop: 20 }}>
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
          {rooms.map((room) => (
            <View key={room.id} style={styles.tableRow}>
              <Text style={styles.headerCell}>{room.type.name.en} {room.room}</Text>
              {timeSlots.map((timeSlot) => {
                const slot = roomTimeSlots.find(
                  (rts) => rts.room.id === room.id && rts.timeSlot.id === timeSlot.id
                );

                return (
                  <TouchableOpacity
                    key={timeSlot.id}
                    style={[
                      styles.cell,
                      slot?.status === 'free' ? styles.freeCell : styles.occupiedCell,
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
          <Modal visible={modalVisible} transparent={true} animationType="slide">
            <View style={styles.modal}>
              <Text>Confirm Reservation for </Text>
              <Text>Room {selectedSlot?.roomId}</Text>
              <Text>Time Slot {selectedSlot?.timeSlotId}</Text>
              <Text></Text>
              <Button title="Confirm" onPress={handleReservation} />
              <Text></Text>
              <Button title="Cancel" onPress={handleCancel} />
            </View>
          </Modal>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerCell: {
    padding: 10,
    backgroundColor: 'gray',
    width: 120,  // Fixed width to match the content cells
    textAlign: 'center',
    fontWeight: 'bold',
  },
  cell: {
    width: 120,  // Fixed width to match the headers
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cellText: {
    color: 'white',
  },
  freeCell: {
    backgroundColor: 'green',
  },
  occupiedCell: {
    backgroundColor: 'red',
  },
  modal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(219, 174, 20, 1)',
  },
});
