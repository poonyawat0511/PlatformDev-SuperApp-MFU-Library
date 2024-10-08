import { User } from "@/utils/UserTypes";

interface UserTableProps {
  user: User;
  onEdit: (user: User) => void;
  onDelete: (userId: string) => void;
}

export default function UserTable({ user, onEdit, onDelete }: UserTableProps) {
  return (
    <div className="max-w-sm w-full h-85 rounded overflow-hidden shadow-lg m-2">
      <div className="px-4 py-2">
        <div className="font-bold text-lg mb-1">{user.username}</div>
        <p className="text-gray-700 text-sm">{user.email}</p>
      </div>
      <div className="flex justify-between px-4 py-2">
        <button
          onClick={() => onEdit(user)}
          className="bg-yellow-500 text-white px-2 py-1 rounded"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(user.id)}
          className="bg-red-500 text-white px-2 py-1 rounded"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
