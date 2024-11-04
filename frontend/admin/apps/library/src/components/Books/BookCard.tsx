import { Book } from "@/utils/BookTypes";
import { BsTrashFill } from "react-icons/bs";
import { LiaPenFancySolid } from "react-icons/lia";

interface BookCardProps {
  book: Book;
  onEdit: (book: Book) => void;
  onDelete: (bookId: string) => void;
}

export default function BookCard({ book, onEdit, onDelete }: BookCardProps) {
  return (
    <div
      className="relative max-w-sm w-80 h-108 rounded-xl overflow-hidden shadow-lg m-2 border-2 border-black-200px"
      style={{
        backgroundImage: `url(${book.bookImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Blurred Background Overlay */}
      <div className="absolute inset-0 bg-transparent bg-opacity-80 backdrop-blur-lg rounded-xl"></div>

      {/* Card Content */}
      <div className="relative z-10 p-4">
        <div className="image py-4 px-4">
          <img
            className="w-full h-56 object-cover rounded-xl"
            src={book.bookImage}
            alt={`${book.name.en} cover`}
          />
        </div>
        <div className="content rounded">
          <div className="title px-4 py-2">
            <div className="font-bold text-lg mb-1 border-b-2 border-white text-white">
              {book.name.en}
            </div>
            <p className="text-gray-700 text-sm text-white">{book.description.en||"-"}</p>
          </div>
          <div className="px-4 pt-2 pb-2">
            <div className="flex items-center mb-1">
              <span className="font-semibold mr-2 text-white">Category:</span>
              <span className="inline-block rounded-full px-2 py-1 text-xs font-semibold text-white">
                {book.category?.name?.en || "Unknown Category"}
              </span>
            </div>
            <div className="flex items-center mb-1">
              <span className="font-semibold mr-2 text-white">Status:</span>
              <span
                className={`inline-block rounded-full px-2 py-1 text-xs font-semibold ${
                  book.status === "not ready"
                    ? "bg-red-200 text-red-700 py-1"
                    : "bg-green-200 text-green-700 py-1"
                }`}
              >
                {book.status}
              </span>
            </div>
            <div className="flex items-center mb-1">
              <span className="font-semibold mr-2 text-white">Quantity:</span>
              <span className="inline-block rounded-full px-2 py-1 text-xs font-semibold text-white">
                {book.quantity}
              </span>
            </div>
            <div className="flex items-center">
              <span className="font-semibold mr-2 text-white">ISBN:</span>
              <span className="inline-block rounded-full px-2 py-1 text-xs font-semibold text-white">
                {book.ISBN||"-"}
              </span>
            </div>
          </div>
        </div>
        <div className="flex justify-between px-4 py-2">
          <button
            onClick={() => onEdit(book)}
            className="bg-white text-black px-2 py-2 rounded-full border border-gray"
          >
            <LiaPenFancySolid className="size-5"/>
          </button>
          <button
            onClick={() => onDelete(book.id)}
            className="bg-black text-white px-2 py-2 rounded-full border border-gray"
          >
           <BsTrashFill className="size-5"/>
          </button>
        </div>
      </div>
    </div>
  );
}
