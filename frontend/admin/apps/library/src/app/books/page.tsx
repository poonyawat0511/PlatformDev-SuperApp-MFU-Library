"use client";
import ConfirmDialog from "@/components/Books/ConfirmDialog";
import * as Icons from "@heroicons/react/24/outline";
import { useGlobalContext } from "@shared/context/GlobalContext";
import { tAlert, tAlertType } from "@shared/utils/types/Alert";
import { useEffect, useState } from "react";
import BookCard from "../../components/Books/BookCard";
import BookForm from "../../components/Books/BookForm";
import { Book } from "../../utils/BookTypes";

const apiUrl = "http://localhost:8082/api/books";

async function fetchBooks(): Promise<Book[]> {
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error("Failed to fetch books");
    }
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export default function BookPage() {
  const { addAlert } = useGlobalContext();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  // State for confirmation dialog
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [bookIdToDelete, setBookIdToDelete] = useState<string | null>(null);

  useEffect(() => {
    fetchBooks().then((data) => {
      setBooks(data);
      setLoading(false);
    });
  }, []);

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

  const handleCreate = () => {
    setEditingBook(null);
    setIsFormOpen(true);
  };

  const handleEdit = (book: Book) => {
    setEditingBook(book);
    setIsFormOpen(true);
  };

  // Function to trigger the confirm dialog
  const confirmDelete = (bookId: string) => {
    setBookIdToDelete(bookId);
    setIsConfirmDialogOpen(true);
  };

  const handleDelete = async () => {
    if (bookIdToDelete) {
      try {
        await fetch(`${apiUrl}/${bookIdToDelete}`, { method: "DELETE" });
        setBooks(books.filter((book) => book.id !== bookIdToDelete));
        handleAddAlert(
          "CheckIcon",
          "Success",
          "Book deleted successfully",
          tAlertType.SUCCESS
        );
        setIsConfirmDialogOpen(false);
      } catch (error) {
        console.error("Failed to delete book:", error);
        handleAddAlert(
          "XCircleIcon",
          "Error",
          "Failed to delete book",
          tAlertType.ERROR
        );
      }
    }
  };

  const handleFormSubmit = async (formData: FormData) => {
    try {
      const id = formData.get("id") as string;
      const method = id ? "PATCH" : "POST";
      const url = id ? `${apiUrl}/${id}` : apiUrl;

      const response = await fetch(url, {
        method,
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        if (id) {
          setBooks(
            books.map((b) => (b.id === result.data.id ? result.data : b))
          );
          handleAddAlert(
            "CheckIcon",
            "Success",
            "Book updated successfully",
            tAlertType.SUCCESS
          );
        } else {
          setBooks([...books, result.data]);
          handleAddAlert(
            "CheckIcon",
            "Success",
            "Book created successfully",
            tAlertType.SUCCESS
          );
        }
        setIsFormOpen(false);
      } else {
        handleAddAlert(
          "XCircleIcon",
          "Error",
          "Failed to submit book",
          tAlertType.ERROR
        );
      }
    } catch (error) {
      console.error("Failed to submit book:", error);
      handleAddAlert(
        "XCircleIcon",
        "Error",
        "Failed to submit book",
        tAlertType.ERROR
      );
    }
  };

  const uniqueCategories = Array.from(
    new Set(books.map((book) => book.category?.name?.en).filter(Boolean))
  );

  const filteredBooks = books.filter((book) => {
    const matchesSearch = book.name.en
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" ||
      book.category?.name?.en === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="px-16">
      <div className="flex justify-between items-center mb-4 px-4 border-b-2">
        <h1 className="text-3xl font-bold">List All Books</h1>
        <button
          onClick={handleCreate}
          className="px-4 py-2 mb-4 bg-black rounded-full text-white shadow-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-white mb-6"
        >
          Add new Book
        </button>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex border rounded-full items-center w-full">
          <div className="flex items-center px-4">
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5a7 7 0 100 14 7 7 0 000-14zM21 21l-4.35-4.35"
              />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search book"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-2 py-2 focus:outline-none"
          />
          <div className="border-l">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 mx-2 text-black focus:outline-none"
            >
              <option value="All">All</option>
              {uniqueCategories.map((category, index) => (
                <option key={index} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap justify-start">
        {filteredBooks.map((book) => (
          <BookCard
            key={book.id}
            book={book}
            onEdit={handleEdit}
            onDelete={() => confirmDelete(book.id)}
          />
        ))}
      </div>

      {isFormOpen && (
        <BookForm
          book={editingBook}
          onSubmit={handleFormSubmit}
          onClose={() => setIsFormOpen(false)}
        />
      )}

      <ConfirmDialog
        isOpen={isConfirmDialogOpen}
        onConfirm={handleDelete}
        onClose={() => setIsConfirmDialogOpen(false)}
        message="Are you sure you want to delete this book?"
      />
    </div>
  );
}
