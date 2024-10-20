"use client";

import { Transaction } from "@/utils/TransactionTypes";
import * as Icons from "@heroicons/react/24/outline";
import { useGlobalContext } from "@shared/context/GlobalContext";
import { tAlert, tAlertType } from "@shared/utils/types/Alert";
import { useEffect, useState } from "react";
import RenewTable from "../../components/Renews/RenewTable";
import { Renew } from "../../utils/RenewType";
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

async function fetchTransactions(): Promise<Transaction[]> {
  try {
    const response = await fetch(transactoinApiUrl);
    if (!response.ok) {
      throw new Error("Failed to fetch transactions");
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
  const [transactions, setTranscations] = useState<Transaction[]>([]);

  const [loading, setLoading] = useState<boolean>(true);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [renewIdToDelete, setRenewIdToDelete] = useState<string | null>(null);
  const { addAlert } = useGlobalContext();

  useEffect(() => {
    const fetchData = async () => {
      const fetchedRenews = await fetchRenews();
      const fetchedTransactions = await fetchTransactions();
      setRenews(fetchedRenews);
      setTranscations(fetchedTransactions);
      setLoading(false);
    };

    fetchData();
  }, []);

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

  const handleUpdateStatus = async (renewId: string, status: string) => {
    try {
      // Find the renew by its ID in the current state to get the transactionId
      const renewToUpdate = renews.find((renew) => renew.id === renewId);
      if (!renewToUpdate) {
        throw new Error("Renew not found");
      }
  
      const transactionId = renewToUpdate.transaction.id || renewToUpdate.transaction; // Ensure to get the transaction ID, not the whole object
  
      // Send both status and transactionId in the request body
      const response = await fetch(`${apiUrl}/${renewId}`, {  // Ensure this is correct
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status,
          transaction: transactionId,  // Include only the transaction ID
        }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to update status");
      }
  
      const result = await response.json();
  
      // Update the renews state
      setRenews(
        renews.map((renew) =>
          renew.id === renewId ? { ...renew, status: result.data.status } : renew
        )
      );
  
      // Add success alert
      handleAddAlert(
        "ExclamationCircleIcon",
        "Success",
        `Renew ${status} successfully`,
        tAlertType.SUCCESS
      );
    } catch (error) {
      console.error(error);
      // Add error alert
      handleAddAlert(
        "ExclamationCircleIcon",
        "Error",
        "Failed to update status",
        tAlertType.ERROR
      );
    }
  };
  
  
  

  const handleDelete = async () => {
    if (!renewIdToDelete) return;

    try {
      const response = await fetch(`${apiUrl}/${renewIdToDelete}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete renew");
      }

      setRenews(renews.filter((renew) => renew.id !== renewIdToDelete));
      handleAddAlert(
        "ExclamationCircleIcon",
        "Success",
        "Renew deleted successfully",
        tAlertType.SUCCESS
      );
    } catch (error) {
      console.error(error);
    } finally {
      setIsConfirmDialogOpen(false);
      setRenewIdToDelete(null);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen p-6">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-4 px-4 border-b-2">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">Renews</h1>
        </div>

        <div className="flex flex-wrap justify-start">
          <RenewTable
            renews={renews}
            onUpdateStatus={handleUpdateStatus}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </div>
  );
}

