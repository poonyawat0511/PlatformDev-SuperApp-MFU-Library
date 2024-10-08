import { Transaction } from "@/utils/TransactionTypes";

interface TransactionTableProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (transactionId: string) => void;
}

export default function TransactionTable({
  transactions,
  onEdit,
  onDelete,
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
            const bookName = transaction.book?.name?.en || transaction.book?.name?.th || "No Data";
            const username = transaction.user?.username || "Unknown User";

            return (
              <tr key={transaction.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 text-center">{username}</td>
                <td className="px-6 py-4 text-center">{bookName}</td>
                <td className="px-6 py-4 capitalize text-center">{transaction.status || "-"}</td>
                <td className="px-6 py-4 text-center">
                  {transaction.dueDate ? new Date(transaction.dueDate).toLocaleDateString() : "-"}
                </td>
                <td className="px-6 py-4 text-center">
                  {transaction.borrowDate ? new Date(transaction.borrowDate).toLocaleDateString() : "-"}
                </td>
                <td className="px-6 py-4 text-center">
                  {transaction.returnDate ? new Date(transaction.returnDate).toLocaleDateString() : "-"}
                </td>
                <td className="px-6 py-4 flex space-x-2 text-center">
                  <button
                    onClick={() => onEdit(transaction)}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 focus:outline-none"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => transaction.id && onDelete(transaction.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 focus:outline-none"
                  >
                    Delete
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
