"use client";

import { useEffect, useState } from "react";
import { Renew } from "../../utils/RenewType";
import RenewForm from "../../components/Renews/RenewForm";
import RenewTable from "../../components/Renews/RenewTable";

const apiUrl = `http://localhost:8082/api/renews`;
const transactoinApiUrl = "http://localhost:8082/api/transactions";

async function fetchRenews(): Promise<Renew[]> {
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error("Failed to fetch renews");
    }
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export default function RenewPage() {
  const [renews, setRenews] = useState<Renew[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [editingRenew, setEditingRenew] = useState<Renew | null>(null);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);

  useEffect(() => {
    fetchRenews().then((data) => {
      setRenews(data);
      setLoading(false);
    });
  }, []);

  const handleCreate = () => {
    setEditingRenew(null);
    setIsFormOpen(true);
  };

  const handleEdit = (renew: Renew) => {
    setEditingRenew(renew);
    setIsFormOpen(true);
  };

  const handleDelete = async (renewId: string) => {
    if (confirm("Are you sure you want to delete this Renew?")) {
      try {
        const response = await fetch(`${apiUrl}/${renewId}`, {
          method: "DELETE",
        });
        if (!response.ok) {
          throw new Error("Failed to delete renew");
        }
        setRenews(renews.filter((renew) => renew.id !== renewId));
      } catch (error) {
        console.error("Failed to delete renew:", error);
      }
    }
  };

  const handleFormSubmit = async (data: Renew) => {
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
          setRenews(
            renews.map((r) => (r.id === result.data.id ? result.data : r))
          );
        } else {
          setRenews([...renews, result.data]);
        }
        setIsFormOpen(false);
      } else {
        const errorText = await response.text();
        console.error(`Failed to submit renew: ${errorText}`);
      }
    } catch (error) {
      console.error("Failed to submit renew:", error);
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
        Create New Request
      </button>
      <div className="flex flex-wrap justify-start">
        {renews.map((renew) => (
          <RenewTable
            key={renew.id}
            renew={renew}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>
      {isFormOpen && (
        <RenewForm
          renew={editingRenew}
          onSubmit={handleFormSubmit}
          onClose={() => setIsFormOpen(false)}
        />
      )}
    </div>
  );
}
