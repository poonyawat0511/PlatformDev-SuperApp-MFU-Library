"use client";

import { Reservation } from "@/utils/ReservationType";
import { Room } from "@/utils/RoomTypes";
import { User } from "@/utils/UserTypes";
import { useGlobalContext } from "@shared/context/GlobalContext";
import { tAlert, tAlertType } from "@shared/utils/types/Alert";
import * as Icons from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import ReservationTable from "@/components/Reservations/ReservationTable";

const apiUrl = `http://localhost:8082/api/reservations`;
const apiRoomUrl = `http://localhost:8082/api/rooms`;
const apiUserUrl = `http://localhost:8082/api/users`;

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

export default function ReservationPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [users, setUsers] = useState<User[]>([]);
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
      const fetchedTransactions = await fetchReservation();
      const fetchedRooms = await fetchRooms();
      const fetchedUsers = await fetchUsers();
      setReservations(fetchedTransactions);
      setRooms(fetchedRooms);
      setUsers(fetchedUsers);
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
        throw new Error("Failed to delete transaction");
      }
      setReservations(
        reservations.filter((t) => t.id !== reservationIdToDelete)
      );
      handleAddAlert(
        "ExclamationCircleIcon",
        "Success",
        "Transaction deleted successfully",
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
        "Transaction updated successfully",
        tAlertType.SUCCESS
      );
      setSelectedReservation(null);
    } catch (error) {
      console.log(error);
    }
  };
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

        {/* {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
            <TransactionForm
              transaction={selectedTransaction}
              onSubmit={handleFormSubmit}
              onClose={() => setIsFormOpen(false)}
              books={books}
              users={users}
            />
          </div>
        </div>
      )} */}

        <div className="flex flex-wrap justify-start">
          <ReservationTable
            reservations={reservations}
            onEdit={handleEdit}
            onDelete={confirmDelete}
          />
        </div>
      </div>
      {/* <ConfirmDialog
      isOpen={isConfirmDialogOpen}
      onConfirm={handleDelete}
      onClose={() => setIsConfirmDialogOpen(false)}
      message="Are you sure you want to delete this transaction?"
    /> */}
    </div>
  );
}
