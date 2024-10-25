import { Transaction } from "@/utils/TransactionTypes";
import { BsTrashFill } from "react-icons/bs";
import { LiaPenFancySolid } from "react-icons/lia";
import { MdAutorenew } from "react-icons/md";

interface TransactionTableProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (transactionId: string) => void;
  onRenew: (transactionId: string) => void;
}

export default function TransactionTable({
  transactions,
  onEdit,
  onDelete,
  onRenew,
}: TransactionTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
        <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
          <tr>
            <th className="px-6 py-3 text-center">User</th>
            <th className="px-6 py-3 text-center">Book</th>
            <th className="px-6 py-3 text-center">Status</th>
            <th className="px-6 py-3 text-center">Due Date</th>
            <th className="px-6 py-3 text-center">Borrow Date</th>
            <th className="px-6 py-3 text-center">Return Date</th>
            <th className="px-6 py-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="text-gray-700">
          {transactions.map((transaction) => {
            const bookName = transaction.book?.ISBN || "No Data";
            const username = transaction.user?.username || "Unknown User";

            return (
              <tr key={transaction.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 text-center">{username}</td>
                <td className="px-6 py-4 text-center">{bookName}</td>
                <td className="px-6 py-4 capitalize text-center">
                  {transaction.status || "-"}
                </td>
                <td className="px-6 py-4 text-center">
                  {transaction.dueDate
                    ? new Date(transaction.dueDate).toLocaleDateString()
                    : "-"}
                </td>
                <td className="px-6 py-4 text-center">
                  {transaction.borrowDate
                    ? new Date(transaction.borrowDate).toLocaleDateString()
                    : "-"}
                </td>
                <td className="px-6 py-4 text-center">
                  {transaction.returnDate
                    ? new Date(transaction.returnDate).toLocaleDateString()
                    : "-"}
                </td>
                <td className="px-6 py-4 flex space-x-2 text-center justify-center">
                  <button
                    onClick={() => onEdit(transaction)}
                    className="bg-white text-black px-2 py-2 rounded-full border border-gray"
                  >
                    <LiaPenFancySolid className="size-5" />
                  </button>
                  <button
                    onClick={() => transaction.id && onDelete(transaction.id)}
                    className="bg-black text-white px-2 py-2 rounded-full border border-gray"
                  >
                    <BsTrashFill className="size-5" />
                  </button>
                  {transaction.status === "borrow" && (
                    <button
                      onClick={() => transaction.id && onRenew(transaction.id)}
                      className="bg-gary-500 text-green px-2 py-2 rounded-full border border-gray"
                    >
                      <MdAutorenew size={18} />
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
