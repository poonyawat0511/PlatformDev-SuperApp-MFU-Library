"use client";

import { useEffect, useState } from "react";
import { Book } from "../../utils/BookTypes";
import { Transaction } from "../../utils/TransactionTypes";
import { User } from "../../utils/UserTypes";
import TransactionForm from "../../components/Transactions/TransactionForm";
import TransactionTable from "../../components/Transactions/TransactionTable";

const apiUrl = `http://localhost:8082/api/transactions`;
const apiBookUrl = `http://localhost:8082/api/books`;
const apiUserUrl = `http://localhost:8082/api/users`;

async function fetchTransaction(): Promise<Transaction[]> {
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error("Failed to fetch transactions");
    }
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.log(error);
    return [];
  }
}

async function fetchBooks(): Promise<Book[]> {
  try {
    const response = await fetch(apiBookUrl);
    if (!response.ok) {
      throw new Error("Failed to fetch books");
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

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("borrow");
  const [searchQuery, setSearchQuery] = useState<string>(""); // State for search query
  const [statusFilter, setStatusFilter] = useState<string>("all"); // State for status filter

  useEffect(() => {
    const fetchData = async () => {
      const fetchedTransactions = await fetchTransaction();
      const fetchedBooks = await fetchBooks();
      const fetchedUsers = await fetchUsers();
      setTransactions(fetchedTransactions);
      setBooks(fetchedBooks);
      setUsers(fetchedUsers);
    };

    fetchData();
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value);
  };

  // Filter transactions by search query and status
  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.book?.ISBN?.toLowerCase().includes(
        searchQuery.toLowerCase()
      ) ||
      transaction.user?.username
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || transaction.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleCreate = () => {
    setSelectedTransaction(null);
    setIsFormOpen(true);
  };

  const handleEdit = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsFormOpen(true);
  };

  const handleDelete = async (transactionId: string) => {
    try {
      const response = await fetch(`${apiUrl}/${transactionId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete transaction");
      }
      setTransactions(transactions.filter((t) => t.id !== transactionId));
    } catch (error) {
      console.log(error);
    }
  };

  const handleFormSubmit = async (formData: Transaction) => {
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
          `Failed to ${method === "POST" ? "create" : "update"} transaction`
        );
      }

      const result = await response.json();
      if (method === "POST") {
        setTransactions([...transactions, result.data]);
      } else {
        setTransactions(
          transactions.map((t) => (t.id === result.data.id ? result.data : t))
        );
      }
      setIsFormOpen(false);
      setSelectedTransaction(null);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-4 px-4 border-b-2">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">
            Transactions
          </h1>
          <button
            onClick={handleCreate}
            className="bg-black text-white px-4 py-2 rounded-full shadow-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-white mb-6"
          >
            New Transaction
          </button>
        </div>

        {/* Search and Filter Section */}
        <div className="flex items-center justify-between mb-6">
          {/* Search Input */}
          <div className="relative w-1/2">
            <input
              type="text"
              placeholder="Search item here"
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-300"
            />
            <svg
              className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-4.35-4.35M9 17a8 8 0 100-16 8 8 0 000 16z"
              />
            </svg>
          </div>

          {/* Status Dropdown */}
          <div className="relative w-1/4">
            <select
              value={statusFilter}
              onChange={handleStatusChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              <option value="all">All Transactions</option>
              <option value="borrow">Borrow</option>
              <option value="return">Return</option>
            </select>
          </div>
        </div>

        {/* Transactions Table or Form */}
        {isFormOpen && (
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
        )}

        {filteredTransactions.length > 0 ? (
          <TransactionTable
            transactions={filteredTransactions}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ) : (
          <div className="text-center text-gray-500">
            No transactions available.
          </div>
        )}
      </div>
    </div>
  );
}
