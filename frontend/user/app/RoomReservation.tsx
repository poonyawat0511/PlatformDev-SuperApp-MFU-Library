import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Modal, Button, Alert } from 'react-native';
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

  useEffect(() => {
    const fetchTimeSlots = async () => {
      const response = await axios.get('http://localhost:8082/api/timeslots/');
      setTimeSlots(response.data.data);
    };

    const fetchRooms = async () => {
      const response = await axios.get('http://localhost:8082/api/rooms/');
      setRooms(response.data.data);
    };

    const fetchRoomTimeSlots = async () => {
      const response = await axios.get('http://localhost:8082/api/room-timeslots/');
      setRoomTimeSlots(response.data.data);
    };

    const fetchUser = async () => {
      const response = await axios.get('http://localhost:8082/api/users/profile');
      setUser(response.data);
    };

    fetchTimeSlots();
    fetchRooms();
    fetchRoomTimeSlots();
    fetchUser();
  }, []);

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
        await axios.post('http://localhost:8082/api/reservations/', {
          room: selectedSlot.roomId,
          user: user.username,
          type: 'pending',
          timeSlot: selectedSlot.timeSlotId,
        });
        Alert.alert('Reservation successful');
        setModalVisible(false); // Close the modal
      } catch (error) {
        console.error('Reservation failed:', error);
        Alert.alert('Reservation failed');
      }
    }
  };

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Room/Time</Text>
      <View>
        <View style={{ flexDirection: 'row' }}>
          <Text style={{ flex: 1 }}>Room/Time</Text>
          {timeSlots.map((timeSlot) => (
            <Text key={timeSlot.id} style={{ flex: 1, textAlign: 'center' }}>
              {timeSlot.start} - {timeSlot.end}
            </Text>
          ))}
        </View>

        {rooms.map((room) => (
          <View key={room.id} style={{ flexDirection: 'row', marginVertical: 5 }}>
            <Text style={{ flex: 1 }}>{room.type.name.en} {room.room}</Text>
            {timeSlots.map((timeSlot) => (
              <TouchableOpacity
                key={timeSlot.id}
                style={{ flex: 1, padding: 10, backgroundColor: '#eaeaea', marginHorizontal: 2 }}
                onPress={() => handleCellClick(room, timeSlot)}
              >
                <Text style={{ textAlign: 'center' }}>
                  {roomTimeSlots.find(
                    (rts) => rts.room.id === room.id && rts.timeSlot.id === timeSlot.id
                  )?.status || 'N/A'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <View style={{ padding: 20, backgroundColor: 'white', borderRadius: 10 }}>
            <Text>Confirm Reservation for Room {selectedSlot?.roomId} and Time Slot {selectedSlot?.timeSlotId}</Text>
            <Button title="Confirm" onPress={handleReservation} />
            <Button title="Cancel" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
}
