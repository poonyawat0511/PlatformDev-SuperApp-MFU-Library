"use client";

import { useEffect, useState } from "react";
import { RoomType } from "../../utils/RoomtypeTypes";
import RoomTypeTable from "../../components/RoomTypes/RoomTable";
import RoomtypeForm from "../../components/RoomTypes/RoomTypeForm";

const apiUrl = `http://localhost:8082/api/room-types`;

async function fetchRoomType(): Promise<RoomType[]> {
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error("Failed to fetch room-types");
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

  useEffect(() => {
    fetchRoomType().then((data) => {
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

  const handleDelete = async (roomTypeId: string) => {
    if (confirm("Are you sure you want to delete this Category?")) {
      try {
        const response = await fetch(`${apiUrl}/${roomTypeId}`, {
          method: "DELETE",
        });
        if (!response.ok) {
          throw new Error("Failed to delete category");
        }
        setRoomTypes(
          roomTypes.filter((roomType) => roomType.id !== roomTypeId)
        );
      } catch (error) {
        console.error("Failed to delete category:", error);
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
          setRoomTypes(
            roomTypes.map((c) => (c.id === result.data.id ? result.data : c))
          );
        } else {
          setRoomTypes([...roomTypes, result.data]);
        }
        setIsFormOpen(false);
      } else {
        const errorText = await response.text();
        console.error(`Failed to submit room-type: ${errorText}`);
      }
    } catch (error) {
      console.error("Failed to submit room-type:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <button
        onClick={handleCreate}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
      >
        Create New Room-Type
      </button>
      <div className="flex flex-wrap justify-start">
        {roomTypes.map((roomType) => (
          <RoomTypeTable
            key={roomType.id}
            roomType={roomType}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>
      {isFormOpen && (
        <RoomtypeForm
          roomTyepe={editingRoomType}
          onSubmit={handleFormSubmit}
          onClose={() => setIsFormOpen(false)}
        />
      )}
    </div>
  );
}
