"server client";
import { Book } from "@/utils/BookTypes";
import { Transaction } from "@/utils/TransactionTypes";
import { User } from "@/utils/UserTypes";
import Modal from "@shared/components/Modal";
import { useGlobalContext } from "@shared/context/GlobalContext";
import React, { useEffect, useState } from "react";
import { GrFormClose } from "react-icons/gr";
import { LiaCheckCircle } from "react-icons/lia";
import * as Icons from "@heroicons/react/24/outline";
import { tAlert, tAlertType } from "@shared/utils/types/Alert";

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
    status:"return",
    dueDate: "",
    borrowDate: "",
    returnDate: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { addAlert } = useGlobalContext();
  const handleAddAlert = (iconName: keyof typeof Icons, title: string, message: string, type: tAlertType) => {
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
    if (transaction) {
      setFormData(transaction);
    }
  }, [transaction]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);
  
    if (!formData.user.username) {
      handleAddAlert("ExclamationCircleIcon", "Username Missing", "Username is required" ,tAlertType.WARNING);
      setIsSubmitting(false);
      return;
    }
    
    if (!formData.book.ISBN) {
      handleAddAlert("ExclamationCircleIcon", "ISBN Missing", "ISBN is required", tAlertType.WARNING);
      setIsSubmitting(false);
      return;
    }
  
    try {
      const isEditing = !!transaction?.id;
  
      await onSubmit({
        id: isEditing ? transaction.id : undefined,
        user: formData.user.username,
        book: formData.book.ISBN,
        status: formData.status,
        dueDate: new Date(formData.dueDate).toISOString(),
        borrowDate: new Date(formData.borrowDate).toISOString(),
        returnDate: formData.returnDate
          ? new Date(formData.returnDate).toISOString()
          : null,
      } as any);
  
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
        status:"return",
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
        user: { ...formData.user, username: value },
      });
    } else if (name === "ISBN") {
      setFormData({
        ...formData,
        book: { ...formData.book, ISBN: value },
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
          name="username"
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
          name="ISBN"
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
