import { Book } from "./BookTypes";
import { User } from "./UserTypes";

export interface Transaction {
  id?: string;
  user: User;
  book: Book;
  status: "borrow" | "return";
  dueDate: string;
  borrowDate: string;
  returnDate?: string | null;
}

