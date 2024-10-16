"server client";
import Modal from "@shared/components/Modal";
import { useGlobalContext } from "@shared/context/GlobalContext";
import React, { useEffect, useState } from "react";
import { GrFormClose } from "react-icons/gr";
import { LiaCheckCircle } from "react-icons/lia";
import * as Icons from "@heroicons/react/24/outline";
import { tAlert, tAlertType } from "@shared/utils/types/Alert";
import { Timeslot } from "@/utils/TimeslotType";

interface TimeslotFormProps {
  timeslot: Timeslot | null;
  onSubmit: (formData: Timeslot) => Promise<void>;
  onClose: () => void;
}

const TransactionForm: React.FC<TimeslotFormProps> = ({
  timeslot,
  onSubmit,
  onClose,
}) => {
  const [formData, setFormData] = useState<Timeslot>({
    id: "",
    start: "",
    end: "",
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
    if (timeslot) {
      setFormData(timeslot);
    }
  }, [timeslot]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    if (!formData.start) {
      handleAddAlert(
        "ExclamationCircleIcon",
        "Stat Time Missing",
        "Stat time is required",
        tAlertType.WARNING
      );
      setIsSubmitting(false);
      return;
    }

    if (!formData.end) {
      handleAddAlert(
        "ExclamationCircleIcon",
        "End Time Missing",
        "End time is required",
        tAlertType.WARNING
      );
      setIsSubmitting(false);
      return;
    }

    try {
      const isEditing = !!timeslot?.id;

      await onSubmit({
        id: isEditing ? timeslot.id : undefined,
        start: formData.start,
        end: formData.end,
      } as any);

      setFormData({
        id:"",
        start:"",
        end:"",
      });
      onClose();
    } catch (error) {
      setError("Failed to submit timeslot. Please check the form inputs.");
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
      title={timeslot ? "Edit Form" : "Create Form"}
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
        <label className="block text-gray-700 font-medium">Start</label>
        <input
          type="text"
          name="start"
          value={formData.start}
          onChange={handleChange}
          placeholder="Enter start time"
          required
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-500"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-gray-700 font-medium">End</label>
        <input
          type="text"
          name="end"
          value={formData.end}
          onChange={handleChange}
          placeholder="Enter end time"
          required
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-500"
        />
      </div>
    </Modal>
  );
};

export default TransactionForm;
