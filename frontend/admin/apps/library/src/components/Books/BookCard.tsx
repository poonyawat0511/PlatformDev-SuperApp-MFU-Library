import { Book } from "@/utils/BookTypes";


interface BookCardProps {
  book: Book;
  onEdit: (book: Book) => void;
  onDelete: (bookId: string) => void;
}

export default function BookCard({ book, onEdit, onDelete }: BookCardProps) {
  return (
    <div className="max-w-sm w-full h-85 rounded overflow-hidden shadow-lg m-2">
      <img
        className="w-full h-40 object-cover"
        src={book.bookImage}
        alt={`${book.name.en} cover`}
      />
      <div className="px-4 py-2">
        <div className="font-bold text-lg mb-1">{book.name.en}</div>
        <p className="text-gray-700 text-sm">{book.description.en}</p>
      </div>
      <div className="px-4 pt-2 pb-2">
        <span className="inline-block bg-gray-200 rounded-full px-2 py-1 text-xs font-semibold text-gray-700 mr-1 mb-1">
          {book.category?.name?.en || "Unknown Category"}
        </span>
        <span
          className={`inline-block rounded-full px-2 py-1 text-xs font-semibold mr-1 mb-1 ${
            book.status === "not ready"
              ? "bg-red-200 text-red-700"
              : "bg-green-200 text-green-700"
          }`}
        >
          Status: {book.status}
        </span>
        <span className="inline-block bg-blue-200 rounded-full px-2 py-1 text-xs font-semibold text-blue-700">
          Quantity: {book.quantity}
        </span>
        <span className="inline-block bg-blue-200 rounded-full px-2 py-1 text-xs font-semibold text-blue-700">
          ISBN: {book.ISBN}
        </span>
      </div>
      <div className="flex justify-between px-4 py-2">
        <button
          onClick={() => onEdit(book)}
          className="bg-yellow-500 text-white px-2 py-1 rounded"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(book.id)}
          className="bg-red-500 text-white px-2 py-1 rounded"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
