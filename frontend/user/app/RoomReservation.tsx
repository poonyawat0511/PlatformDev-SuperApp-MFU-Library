import React, { useEffect, useState } from 'react';
import { View, Text, Image, ImageBackground, ScrollView, StyleSheet, TouchableOpacity, Modal, Button, Alert } from 'react-native';
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
    <ImageBackground
      source={require('../assets/images/LibraryMFUBG.png')}
      imageStyle={{ opacity: 0.5 }}
      style={styles.background}
    >
      <View>
        {/* Text and Image Above Table */}
        <View style={{ alignItems: 'center', marginBottom: 10, marginTop: 20 }}>
          <Image source={require('../assets/images/LibraryMFURoomRuleBanner.png')} style={{ width: 350, height: 100 }} />
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
            {rooms
              .sort((a, b) => a.type.name.en.localeCompare(b.type.name.en)) // Sort rooms by name
              .map((room) => (
                <View key={room.id} style={styles.tableRow}>
                  <Text style={styles.headerCell}>
                    {room.type.name.en} {room.room}
                  </Text>
                  {timeSlots.map((timeSlot) => {
                    const slot = roomTimeSlots.find(
                      (rts) => rts.room.id === room.id && rts.timeSlot.id === timeSlot.id
                    );

                    return (
                      <TouchableOpacity
                        key={timeSlot.id}
                        style={[
                          styles.cell,
                          slot
                            ? slot.status === 'free'
                              ? styles.freeCell
                              : slot.status === 'reserved'
                                ? styles.reservedCell
                                : styles.inUseCell
                            : styles.emptyCell
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
              <View style={styles.modalContainer}>
                <View style={styles.modal}>
                  {selectedSlot && (
                    <>
                      <Text>Confirm Reservation for</Text>
                      {/* Find the selected room and time slot details */}
                      <Text>
                        Room: {rooms.find(room => room.id === selectedSlot.roomId)?.type.name.en}{' '}
                        {rooms.find(room => room.id === selectedSlot.roomId)?.room}
                      </Text>
                      <Text>
                        Time Slot: {timeSlots.find(slot => slot.id === selectedSlot.timeSlotId)?.start} -{' '}
                        {timeSlots.find(slot => slot.id === selectedSlot.timeSlotId)?.end}
                      </Text>
                      <Text></Text>
                      <Button title="Confirm" onPress={handleReservation} />
                      <Text></Text>
                      <Button title="Cancel" onPress={handleCancel} />
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
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerCell: {
    padding: 10,
    backgroundColor: '#E3E1E1',
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
    color: 'dark',
  },
  freeCell: {
    backgroundColor: 'green',
  },
  reservedCell: {
    backgroundColor: 'yellow',
  },
  inUseCell: {
    backgroundColor: 'red',
  },
  emptyCell: {
    backgroundColor: 'red',
    opacity: 0
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center', // Center vertically
    alignItems: 'center', // Center horizontally
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Optional: dim background
  },
  modal: {
    width: 300, // Set a fixed width
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
});
