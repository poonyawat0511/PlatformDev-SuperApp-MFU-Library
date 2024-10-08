"use client";
import { useEffect, useState } from "react";
import { Book } from "../../utils/BookTypes";
import BookCard from "../../components/Books/BookCard";
import BookForm from "../../components/Books/BookForm";

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
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);

  useEffect(() => {
    fetchBooks().then((data) => {
      setBooks(data);
      setLoading(false);
    });
  }, []);

  const handleCreate = () => {
    setEditingBook(null);
    setIsFormOpen(true);
  };

  const handleEdit = (book: Book) => {
    setEditingBook(book);
    setIsFormOpen(true);
  };

  const handleDelete = async (bookId: string) => {
    if (confirm("Are you sure you want to delete this book?")) {
      try {
        await fetch(`${apiUrl}/${bookId}`, { method: "DELETE" });
        setBooks(books.filter((book) => book.id !== bookId));
      } catch (error) {
        console.error("Failed to delete book:", error);
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
        } else {
          setBooks([...books, result.data]);
        }
        setIsFormOpen(false);
      }
    } catch (error) {
      console.error("Failed to submit book:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <button
        onClick={handleCreate}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
      >
        Create New Book
      </button>
      <div className="flex flex-wrap justify-start">
        {books.map((book) => (
          <BookCard
            key={book.id}
            book={book}
            onEdit={handleEdit}
            onDelete={handleDelete}
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
    </div>
  );
}
