import { User } from "@/utils/UserTypes";
import { BsTrashFill } from "react-icons/bs";
import { LiaPenFancySolid } from "react-icons/lia";

interface UserTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (userId: string) => void;
}

export default function UserTable({ users, onEdit, onDelete }: UserTableProps) {
  return (
    <div className="overflow-x-auto w-full">
      <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
        <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
          <tr>
            <th className="px-6 py-3 text-center">Email</th>
            <th className="px-6 py-3 text-center">Username</th>
            <th className="px-6 py-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="text-gray-700">
          {users.map((user) => {
            const Email = user.email || "No Data";
            const Username = user.username || "No Data";

            return (
              <tr key={user.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 text-center">{Email}</td>
                <td className="px-6 py-4 text-center">{Username}</td>
                <td className="px-6 py-4 flex space-x-2 text-center justify-center">
                  <button
                    onClick={() => onEdit(user)}
                    className="bg-white text-black px-2 py-2 rounded-full border border-gray"
                  >
                    <LiaPenFancySolid className="size-5" />
                  </button>
                  <button
                    onClick={() => user.id && onDelete(user.id)}
                    className="bg-black text-white px-2 py-2 rounded-full border border-gray"
                  >
                    <BsTrashFill className="size-5" />
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
