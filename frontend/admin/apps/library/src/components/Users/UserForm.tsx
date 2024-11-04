import { User } from "@/utils/UserTypes";
import * as Icons from "@heroicons/react/24/outline";
import Modal from "@shared/components/Modal";
import { useGlobalContext } from "@shared/context/GlobalContext";
import { tAlert, tAlertType } from "@shared/utils/types/Alert";
import React, { useEffect, useState } from "react";
import { GrFormClose } from "react-icons/gr";
import { LiaCheckCircle } from "react-icons/lia";

interface UserFormProps {
  user: User | null;
  onSubmit: (formData: User) => Promise<void>;
  onClose: () => void;
}

const UserForm: React.FC<UserFormProps> = ({ user, onSubmit, onClose }) => {
  const [formData, setFormData] = useState<User>({
    id: user?.id || "",
    username: user?.username || "",
    email: user?.email || "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
    if (user) {
      setFormData({
        id: user.id,
        username: user.username,
        email: user.email,
        password: "",
      });
    } else {
      setFormData({
        id: "",
        username: "",
        email: "",
        password: "",
      });
    }
  }, [user]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    if (!formData.username) {
      handleAddAlert(
        "ExclamationCircleIcon",
        "Username Missing",
        "Username is required",
        tAlertType.WARNING
      );
      setIsSubmitting(false);
      return;
    }

    if (!formData.email) {
      handleAddAlert(
        "ExclamationCircleIcon",
        "Email Missing",
        "Email is required",
        tAlertType.WARNING
      );
      setIsSubmitting(false);
      return;
    }

    try {
      await onSubmit({
        ...formData,
        id: formData.id || undefined,
      });
      setFormData({
        id: "",
        username: "",
        email: "",
        password: "",
      });
      onClose();
    } catch (error) {
      setError("Failed to submit user. Please check the form inputs.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;

    setFormData({ ...formData, [name]: value });
  };

  return (
    <Modal
      isOpen={true}
      title={user ? "Edit Form" : "Create Form"}
      onClose={onClose}
      actions={
        <div className="flex justify-between">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
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
          value={formData.username}
          onChange={handleChange}
          placeholder="Enter username"
          required
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-500"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-gray-700 font-medium">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter Email"
          required
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-500"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-gray-700 font-medium">Password</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter Password"
          required
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-500"
        />
      </div>
    </Modal>
  );
};

export default UserForm;