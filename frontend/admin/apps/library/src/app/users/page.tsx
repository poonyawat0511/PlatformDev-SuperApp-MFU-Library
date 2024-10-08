"use client";

import { useEffect, useState } from "react";
import { User } from "../../utils/UserTypes";
import UserForm from "../../components/Users/UserForm";
import UserTable from "../../components/Users/UserTable";

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
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);

  useEffect(() => {
    fetchUsers().then((data) => {
      setUsers(data);
      setLoading(false);
    });
  }, []);

  const handleCreate = () => {
    setEditingUser(null);
    setIsFormOpen(true);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setIsFormOpen(true);
  };

  const handleDelete = async (userId: string) => {
    if (confirm("Are you sure you want to delete this User?")) {
      try {
        const response = await fetch(`${apiUrl}/${userId}`, {
          method: "DELETE",
        });
        if (response.ok) {
          setUsers(users.filter((user) => user.id !== userId));
        } else {
          const errorText = await response.text();
          console.error(`Failed to delete user: ${errorText}`);
        }
      } catch (error) {
        console.error("Failed to delete user:", error);
      }
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
    <div>
      <button
        onClick={handleCreate}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
      >
        Create New User
      </button>
      <div className="flex flex-wrap justify-start">
        {users && users.length > 0 ? (
          <div className="flex flex-wrap justify-start">
            {users.map((user) => (
              <UserTable
                key={user.id}
                user={user}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          <div>No users found</div>
        )}
      </div>
      {isFormOpen && (
        <UserForm
          user={editingUser}
          onSubmit={handleFormSubmit}
          onClose={() => setIsFormOpen(false)}
        />
      )}
    </div>
  );
}
