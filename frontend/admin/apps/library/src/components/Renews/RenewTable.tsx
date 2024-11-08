import { Renew } from "@/utils/RenewType";
import { FaTimes } from "react-icons/fa";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";

interface RenewTableProps {
  renews: Renew[];
  onUpdateStatus: (renewId: string, status: string) => void;
  onDelete: (renewId: string) => void;
}

export default function RenewTable({
  renews,
  onUpdateStatus,
  onDelete,
}: RenewTableProps) {
  return (
    <div className="overflow-x-auto w-full">
      <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
        <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
          <tr>
            <th className="px-6 py-3 text-center">User</th>
            <th className="px-6 py-3 text-center">Book ISBN</th>
            <th className="px-6 py-3 text-center">Status</th>
            <th className="px-6 py-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="text-gray-700">
          {renews.map((renew) => {
            return (
              <tr key={renew.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 text-center">
                  {renew.transaction?.user?.username||"-"}
                </td>
                <td className="px-6 py-4 capitalize text-center">
                  {renew.transaction?.book?.ISBN || "-"}
                </td>
                <td className="px-6 py-4 capitalize text-center">
                  {renew.status || "-"}
                </td>
                <td className="px-6 py-4 flex space-x-2 text-center justify-center">
                  <button
                    onClick={() => onUpdateStatus(renew.id, "approved")}
                    style={{ backgroundColor: "#6DDABE", color: "white" }}
                    className="px-2 py-2 rounded-full border border-gray"
                  >
                    <IoMdCheckmarkCircleOutline className="size-5" />
                  </button>
                  <button
                    onClick={() => onUpdateStatus(renew.id, "rejected")}
                    style={{ backgroundColor: "#EF5A6F", color: "white" }}
                    className="px-2 py-2 rounded-full border border-gray"
                  >
                    <FaTimes className="size-5" />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
