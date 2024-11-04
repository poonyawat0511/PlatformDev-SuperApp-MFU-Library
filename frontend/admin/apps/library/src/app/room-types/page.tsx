"use client";

import * as Icons from "@heroicons/react/24/outline";
import { useGlobalContext } from "@shared/context/GlobalContext";
import { tAlert, tAlertType } from "@shared/utils/types/Alert";
import { useEffect, useState } from "react";
import ConfirmDialog from "../../components/RoomTypes/ConfirmDialog";
import RoomTypeForm from "../../components/RoomTypes/RoomTypeForm";
import RoomTypeTable from "../../components/RoomTypes/RoomTypeTable";
import { RoomType } from "../../utils/RoomtypeTypes";

const apiUrl = `http://localhost:8082/api/room-types`;

async function fetchRoomTypes(): Promise<RoomType[]> {
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error("Failed to fetch room types");
    }
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export default function RoomTypePage() {
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [editingRoomType, setEditingRoomType] = useState<RoomType | null>(null);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState<boolean>(false);
  const [selectedRoomTypeId, setSelectedRoomTypeId] = useState<string | null>(null); // Track room type for deletion
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
    fetchRoomTypes().then((data) => {
      setRoomTypes(data);
      setLoading(false);
    });
  }, []);

  const handleCreate = () => {
    setEditingRoomType(null);
    setIsFormOpen(true);
  };

  const handleEdit = (roomType: RoomType) => {
    setEditingRoomType(roomType);
    setIsFormOpen(true);
  };

  const openConfirmDialog = (roomTypeId: string) => {
    setSelectedRoomTypeId(roomTypeId);  
    setIsConfirmDialogOpen(true); 
  };

  const handleDelete = async () => {
    if (selectedRoomTypeId) {
      try {
        const response = await fetch(`${apiUrl}/${selectedRoomTypeId}`, {
          method: "DELETE",
        });
        if (!response.ok) {
          throw new Error("Failed to delete room type");
        }
        setRoomTypes(roomTypes.filter((roomType) => roomType.id !== selectedRoomTypeId));
        setIsConfirmDialogOpen(false);
        setSelectedRoomTypeId(null);
        handleAddAlert("ExclamationCircleIcon", "Success", "Room-Type deleted successfully", tAlertType.SUCCESS);
      } catch (error) {
        console.error("Failed to delete room type:", error);
      }
    }
  };

  const handleFormSubmit = async (data: RoomType) => {
    try {
      const isUpdate = !!data.id;
      const method = isUpdate ? "PATCH" : "POST";
      const url = isUpdate ? `${apiUrl}/${data.id}` : apiUrl;

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        if (isUpdate) {
          setRoomTypes(roomTypes.map((r) => (r.id === result.data.id ? result.data : r)));
        } else {
          setRoomTypes([...roomTypes, result.data]);
        }
        setIsFormOpen(false);
        handleAddAlert(
          "ExclamationCircleIcon",
          "Success",
          "Room-Type updated successfully",
          tAlertType.SUCCESS
        );
      } else {
        const errorText = await response.text();
        console.error(`Failed to submit room type: ${errorText}`);
      }
    } catch (error) {
      console.error("Failed to submit room type:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
        <div className="flex justify-between items-center mb-4 px-4 border-b-2">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">
            Room Types
          </h1>
          <button
            onClick={handleCreate}
            className="bg-black text-white px-4 py-2 rounded-full shadow-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-white mb-6"
          >
            New Room Type
          </button>
        </div>
      <RoomTypeTable
        roomTypes={roomTypes}
        onEdit={handleEdit}
        onDelete={openConfirmDialog}  
      />
      {isFormOpen && (
        <RoomTypeForm
          roomType={editingRoomType}
          onSubmit={handleFormSubmit}
          onClose={() => setIsFormOpen(false)}
        />
      )}
      <ConfirmDialog
        isOpen={isConfirmDialogOpen}
        message="Are you sure you want to delete this room type?"
        onConfirm={handleDelete}  
        onClose={() => setIsConfirmDialogOpen(false)}  
      />
    </div>
  );
}
