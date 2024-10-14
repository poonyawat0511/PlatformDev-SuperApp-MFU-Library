"server client";
import { Book } from "@/utils/BookTypes";
import { Transaction } from "@/utils/TransactionTypes";
import { User } from "@/utils/UserTypes";
import Modal from "@shared/components/Modal";
import React, { useEffect, useState } from "react";
import { GrFormClose } from "react-icons/gr";
import { LiaCheckCircle } from "react-icons/lia";

interface TransactionFormProps {
  transaction: Transaction | null;
  onSubmit: (formData: Transaction) => Promise<void>;
  onClose: () => void;
  books: Book[];
  users: User[];
}

const TransactionForm: React.FC<TransactionFormProps> = ({
  transaction,
  onSubmit,
  onClose,
}) => {
  const [formData, setFormData] = useState<Transaction>({
    user: { id: "", email: "", username: "", password: "" },
    book: {
      id: "",
      name: { th: "", en: "" },
      description: { th: "", en: "" },
      ISBN: "",
      bookImage: "",
      category: { id: "", name: { th: "", en: "" } },
      status: "",
      quantity: 0,
    },
    status: "borrow" || "return",
    dueDate: "",
    borrowDate: "",
    returnDate: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (transaction) {
      setFormData(transaction);
    }
  }, [transaction]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Check if we're updating or creating a new transaction
      const isEditing = !!transaction?.id;

      // Send form data with `username` and `ISBN` as strings, along with the id if editing
      await onSubmit({
        id: isEditing ? transaction.id : undefined, // Include the id for update
        user: formData.user.username, // Send username as string
        book: formData.book.ISBN, // Send ISBN as string
        status: formData.status,
        dueDate: new Date(formData.dueDate).toISOString(),
        borrowDate: new Date(formData.borrowDate).toISOString(),
        returnDate: formData.returnDate
          ? new Date(formData.returnDate).toISOString()
          : null,
      } as any); // Type-cast if necessary to avoid TypeScript errors

      // Reset form data after submission
      setFormData({
        user: { id: "", email: "", username: "", password: "" },
        book: {
          id: "",
          name: { th: "", en: "" },
          description: { th: "", en: "" },
          ISBN: "",
          bookImage: "",
          category: { id: "", name: { th: "", en: "" } },
          status: "",
          quantity: 0,
        },
        status: "borrow" || "return",
        dueDate: "",
        borrowDate: "",
        returnDate: null,
      });

      onClose();
    } catch (error) {
      setError("Failed to submit transaction. Please check the form inputs.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;

    if (name === "username") {
      setFormData({
        ...formData,
        user: { ...formData.user, username: value }, // Update nested user.username
      });
    } else if (name === "ISBN") {
      setFormData({
        ...formData,
        book: { ...formData.book, ISBN: value }, // Update nested book.ISBN
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  return (
    <Modal
    isOpen={true}
    title={transaction ? "Edit Form" : "Create Form"}
    onClose={onClose}
    actions={
      <div className="flex justify-between">
        <button
          onClick={handleSubmit}
          className="bg-black text-white px-2 py-2 rounded-full"
        >
          <LiaCheckCircle className="size-6" />
        </button>
        <button
          onClick={onClose}
          className="bg-gray-500 text-white px-2 py-2 rounded-full ml-6"
        >
          <GrFormClose className="size-6" />
        </button>
      </div>
    }
    >
      {error && <p className="text-red-500">{error}</p>}

      <div className="space-y-2">
        <label className="block text-gray-700 font-medium">Username</label>
        <input
          type="text"
          name="username" // Adjusted name
          value={formData.user.username}
          onChange={handleChange}
          placeholder="Enter username"
          required
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-500"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-gray-700 font-medium">ISBN</label>
        <input
          type="text"
          name="ISBN" // Adjusted name
          value={formData.book.ISBN}
          onChange={handleChange}
          placeholder="Enter ISBN"
          required
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-500"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-gray-700 font-medium">Status</label>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          required
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-500"
        >
          <option value="">Select status</option>
          <option value="borrow">Borrow</option>
          <option value="return">Return</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="block text-gray-700 font-medium">Due Date</label>
        <input
          type="datetime-local"
          name="dueDate"
          value={formData.dueDate}
          onChange={handleChange}
          required
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-500"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-gray-700 font-medium">Borrow Date</label>
        <input
          type="datetime-local"
          name="borrowDate"
          value={formData.borrowDate}
          onChange={handleChange}
          required
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-500"
        />
      </div>

      {/* Conditionally render the Return Date field if the status is "return" */}
      {formData.status === "return" && (
        <div className="space-y-2">
          <label className="block text-gray-700 font-medium">Return Date</label>
          <input
            type="datetime-local"
            name="returnDate"
            value={formData.returnDate || ""}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-500"
          />
        </div>
      )}
    </Modal>
  );
};

export default TransactionForm;
