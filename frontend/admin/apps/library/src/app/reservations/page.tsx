"use client";

import ConfirmDialog from "@/components/Reservations/ConfirmDialog";
import ReservationForm from "@/components/Reservations/ReservationForm";
import ReservationTable from "@/components/Reservations/ReservationTable";
import { Reservation } from "@/utils/ReservationType";
import { Room } from "@/utils/RoomTypes";
import { Timeslot } from "@/utils/TimeslotType";
import { User } from "@/utils/UserTypes";
import * as Icons from "@heroicons/react/24/outline";
import { useGlobalContext } from "@shared/context/GlobalContext";
import { tAlert, tAlertType } from "@shared/utils/types/Alert";
import { useEffect, useState } from "react";

const apiUrl = `http://localhost:8082/api/reservations`;
const apiRoomUrl = `http://localhost:8082/api/rooms`;
const apiUserUrl = `http://localhost:8082/api/users`;
const apiTimeSlotUrl = `http://localhost:8082/api/timeslots`;

async function fetchReservation(): Promise<Reservation[]> {
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error("Failed to fetch reservations");
    }
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.log(error);
    return [];
  }
}

async function fetchRooms(): Promise<Room[]> {
  try {
    const response = await fetch(apiRoomUrl);
    if (!response.ok) {
      throw new Error("Failed to fetch rooms");
    }
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.log(error);
    return [];
  }
}

async function fetchUsers(): Promise<User[]> {
  try {
    const response = await fetch(apiUserUrl);
    if (!response.ok) {
      throw new Error("Failed to fetch users");
    }
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.log(error);
    return [];
  }
}

async function fetchTimeslots(): Promise<Timeslot[]> {
  try {
    const response = await fetch(apiTimeSlotUrl);
    if (!response.ok) {
      throw new Error("Failed to fetch timeSlot");
    }
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.log(error);
    return [];
  }
}

export default function ReservationPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [users, setUsers] = useState<User[]>([]);
  const [timeSlots, setTimeSlots] = useState<Timeslot[]>([]);
  const [selectedReservation, setSelectedReservation] =
    useState<Reservation | null>(null);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);

  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [reservationIdToDelete, setReservationIdToDelete] = useState<
    string | null
  >(null);
  const { addAlert } = useGlobalContext();
  const handleAddAlert = (
    iconName: keyof typeof Icons,
    title: string,
    message: string,
    type: tAlertType
  ) => {
    const newAlert: tAlert = {
      title: title,
      message: message,
      buttonText: "X",
      iconName: iconName,
      type: type,
      id: Math.random().toString(36).substring(2, 9),
    };
    addAlert(newAlert);
  };

  useEffect(() => {
    const fetchData = async () => {
      const fetchedReservations = await fetchReservation();
      const fetchedRooms = await fetchRooms();
      const fetchedUsers = await fetchUsers();
      const fetchTimeSlots = await fetchTimeslots();
      setReservations(fetchedReservations);
      setRooms(fetchedRooms);
      setUsers(fetchedUsers);
      setTimeSlots(fetchTimeSlots);
      setLoading(false);
    };

    fetchData();
  }, []);

  const handleCreate = () => {
    setSelectedReservation(null);
    setIsFormOpen(true);
  };

  const handleEdit = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setIsFormOpen(true);
  };

  const confirmDelete = (reservationId: string) => {
    setReservationIdToDelete(reservationId);
    setIsConfirmDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!reservationIdToDelete) return;

    try {
      const response = await fetch(`${apiUrl}/${reservationIdToDelete}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete reservation");
      }
      setReservations(
        reservations.filter((t) => t.id !== reservationIdToDelete)
      );
      handleAddAlert(
        "ExclamationCircleIcon",
        "Success",
        "reservation deleted successfully",
        tAlertType.SUCCESS
      );
    } catch (error) {
      console.log(error);
    } finally {
      setIsConfirmDialogOpen(false);
      setReservationIdToDelete(null);
    }
  };

  const handleFormSubmit = async (formData: Reservation) => {
    try {
      const method = formData.id ? "PATCH" : "POST";
      const url = apiUrl + (formData.id ? `/${formData.id}` : "");

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(
          `Failed to ${method === "POST" ? "create" : "update"} reservation`
        );
      }

      const result = await response.json();
      if (method === "POST") {
        setReservations([...reservations, result.data]);
      } else {
        setReservations(
          reservations.map((t) => (t.id === result.data.id ? result.data : t))
        );
      }
      setIsFormOpen(false);
      handleAddAlert(
        "ExclamationCircleIcon",
        "Success",
        "reservation updated successfully",
        tAlertType.SUCCESS
      );
      setSelectedReservation(null);
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <div className="min-h-screen p-6">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-4 px-4 border-b-2">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">Reservation</h1>
          <button
            onClick={handleCreate}
            className="bg-black text-white px-4 py-2 rounded-full shadow-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-white mb-6"
          >
            New Reservation
          </button>
        </div>

        {isFormOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
              <ReservationForm
                reservation={selectedReservation}
                onSubmit={handleFormSubmit}
                onClose={() => setIsFormOpen(false)}
                rooms={rooms}
                users={users}
                timeSlot={timeSlots}
              />
            </div>
          </div>
        )}

        <div className="flex flex-wrap justify-start">
          <ReservationTable
            reservations={reservations}
            onEdit={handleEdit}
            onDelete={confirmDelete}
          />
        </div>
      </div>
      <ConfirmDialog
        isOpen={isConfirmDialogOpen}
        onConfirm={handleDelete}
        onClose={() => setIsConfirmDialogOpen(false)}
        message="Are you sure you want to delete this reservation?"
      />
    </div>
  );
}
