"use client";

import ConfirmDialog from "@/components/Users/ConfirmDialog";
import * as Icons from "@heroicons/react/24/outline";
import { useGlobalContext } from "@shared/context/GlobalContext";
import { tAlert, tAlertType } from "@shared/utils/types/Alert";
import { useEffect, useState } from "react";
import UserForm from "../../components/Users/UserForm";
import UserTable from "../../components/Users/UserTable";
import { User } from "../../utils/UserTypes";

const apiUrl = "http://localhost:8082/api/users";

const fetchUsers = async (): Promise<User[]> => {
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error("Failed to fetch users");
    }
    const result = await response.json();
    return result.map((user: any) => ({
      id: user._id,
      email: user.email,
      username: user.username,
    }));
  } catch (error) {
    console.error(error);
    return [];
  }
};

export default function UserPage() {
  const { addAlert } = useGlobalContext();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState<string | null>(
    null
  );
  const [selectedUser, setSelectedUser] = useState<User | null>(
    null
  );
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
      const fetchedUsers = await fetchUsers();
      setUsers(fetchedUsers);
      setLoading(false);
    };

    fetchData();
  }, []);

  const handleCreate = () => {
    setSelectedUser(null);
    setIsFormOpen(true);
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setIsFormOpen(true);
  };

  const confirmDelete = (userId: string) => {
    setUserIdToDelete(userId);
    setIsConfirmDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!userIdToDelete) return;
  
    try {
      const response = await fetch(`${apiUrl}/${userIdToDelete}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete timeslot");
      }
      setUsers(users.filter((t) => t.id !== userIdToDelete));
      handleAddAlert("ExclamationCircleIcon", "Success", "Transaction deleted successfully", tAlertType.SUCCESS);
    } catch (error) {
      console.log(error);
    } finally {
      setIsConfirmDialogOpen(false);
      setUserIdToDelete(null);
    }
  };

  const handleFormSubmit = async (data: User) => {
    try {
      const isUpdate = !!data.id;
      const url = isUpdate
        ? `${apiUrl}/${data.id}`
        : "http://localhost:8082/api/users/register";

      const method = isUpdate ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();

        if (result && result.data) {
          if (isUpdate) {
            setUsers((prevUsers) =>
              Array.isArray(prevUsers)
                ? prevUsers.map((c) =>
                    c.id === result.data.id ? result.data : c
                  )
                : []
            );
          } else {
            setUsers((prevUsers) =>
              Array.isArray(prevUsers)
                ? [...prevUsers, result.data]
                : [result.data]
            );
          }
        }
        setIsFormOpen(false);
        handleAddAlert(
          "ExclamationCircleIcon",
          "Success",
          "User updated successfully",
          tAlertType.SUCCESS
        );
      } else {
        const errorText = await response.text();
        console.error(`Failed to submit user: ${errorText}`);
      }
    } catch (error) {
      console.error("Failed to submit user:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen p-6">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-4 px-4 border-b-2">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">
            User
          </h1>
          <button
            onClick={handleCreate}
            className="bg-black text-white px-4 py-2 rounded-full shadow-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-white mb-6"
          >
            New User
          </button>
        </div>
        <div className="flex flex-wrap justify-start">
          <UserTable
            users={users}
            onEdit={handleEdit}
            onDelete={confirmDelete}
          />
        </div>

        {isFormOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
              <UserForm
                user={selectedUser}
                onSubmit={handleFormSubmit}
                onClose={() => setIsFormOpen(false)}
              />
            </div>
          </div>
        )}
      </div>
      <ConfirmDialog
        isOpen={isConfirmDialogOpen}
        onConfirm={handleDelete}
        onClose={() => setIsConfirmDialogOpen(false)}
        message="Are you sure you want to delete this time slot?"
      />
    </div>
  );
}
