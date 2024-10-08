"server client";
import { Renew } from "@/utils/RenewType";

interface RenewTableProps {
  renew: Renew;
  onEdit: (renew: Renew) => void;
  onDelete: (renewId: string) => void;
}

export default function RenewTable({
  renew,
  onEdit,
  onDelete,
}: RenewTableProps) {
  return (
    <div className="max-w-sm w-full h-85 rounded overflow-hidden shadow-lg m-2">
      <div className="px-4 py-2">
        <div className="font-bold text-lg mb-1">{renew.status}</div>
        <p className="text-gray-700 text-sm">{renew.transaction.id}</p>
      </div>
      <div className="px-4 pt-2 pb-2"></div>
      <div className="flex justify-between px-4 py-2">
        <button
          onClick={() => onEdit(renew)}
          className="bg-yellow-500 text-white px-2 py-1 rounded"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(renew.id)}
          className="bg-red-500 text-white px-2 py-1 rounded"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
