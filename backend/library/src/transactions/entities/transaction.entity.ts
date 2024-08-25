import { MongoEntity } from "src/app/common/lib/mongo.entiy";
import { TransactionsStatus } from "../enums/transactions-status.enum";
import { Types } from "mongoose";
import { TransformId } from "src/app/decorator/transform-id.decorator";
import { BookEntity } from "src/books/entities/book.entity";
import { Book } from "src/books/schemas/book.schema";
import { UserEntity } from "src/users/entities/user.entity";
import { User } from "src/users/schemas/user.schema";

export class TransactionEntity extends MongoEntity {
  @TransformId((v) => new UserEntity(v))
  user?: Types.ObjectId | User | null;

  @TransformId((v) => new BookEntity(v))
  book?: Types.ObjectId | Book | null;

  status: TransactionsStatus;

  dueDate: Date;

  borrowDate: Date;

  returnDate: Date;

  constructor(partial: Partial<TransactionEntity>) {
    super();
    Object.assign(this, partial);
  }
}
