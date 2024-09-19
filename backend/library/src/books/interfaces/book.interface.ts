import { Types } from "mongoose";
import { BookDTO } from "../dto/book.dto";
import { BookStatus } from "../enums/book-status.enum";

interface BookInterface {
  _id: Types.ObjectId;
  name: BookDTO;

  description: BookDTO;

  ISBN: string;

  bookImage: string;

  category: string;

  status: BookStatus;

  quantity: number;
}

export default BookInterface;
