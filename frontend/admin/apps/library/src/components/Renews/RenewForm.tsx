import { Renew } from "@/utils/RenewType";
import { useEffect, useState } from "react";

interface RenewFormProps {
  renew?: Renew | null;
  onSubmit: (data: Omit<Renew, "status"> | Renew) => void;
  onClose: () => void;
}

export default function RenewForm({
  renew,
  onSubmit,
  onClose,
}: RenewFormProps) {
  const [status, setStatus] = useState<string>("request");
  const [transactionId, setTransactionId] = useState<string>("");

  useEffect(() => {
    if (renew) {
      setStatus(renew.status);
      setTransactionId(renew.transaction.id || "");
    }
  }, [renew]);

  const isValidObjectId = (id: string) => {
    return /^[a-fA-F0-9]{24}$/.test(id); // Regex to validate MongoDB ObjectId
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isValidObjectId(transactionId)) {
      alert("Invalid Transaction ID. Please enter a valid MongoDB ObjectId.");
      return;
    }

    // If we're creating a new renew, exclude the status field
    const isCreating = !renew;

    const data: Omit<Renew, "status"> | Renew = isCreating
      ? {
          id: renew?.id || "",
          transaction: transactionId || null, // Send only the transaction ID when creating
        }
      : {
          id: renew?.id || "",
          transaction: transactionId,
          status, // Include the status only if it's an update
        };

    onSubmit(data);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">
          {renew ? "Edit Renew Request" : "Create Renew Request"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Transaction ID
            </label>
            <input
              type="text"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>

          {/* Only show the status field for editing (not creating) */}
          {renew && (
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              >
                <option value="approved">approved</option>
                <option value="rejected">rejected</option>
                <option value="request">request</option>
              </select>
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              {renew ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
