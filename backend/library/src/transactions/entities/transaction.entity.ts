import { MongoEntity } from 'src/app/common/lib/mongo.entiy';
import { TransactionsType } from '../enums/transactions-type.enum';

import { User } from 'src/users/schemas/user.schema';
import { Types } from 'mongoose';
import { Book } from 'src/books/schemas/book.schema';
import { TransformId } from 'src/app/decorator/transform-id.decorator';
import { UserEntity } from 'src/users/entities/user.entity';
import { BookEntity } from 'src/books/entities/book.entity';

export class TransactionEntity extends MongoEntity {
  @TransformId((v) => new UserEntity(v))
  user?: Types.ObjectId | User | null;

  @TransformId((v) => new BookEntity(v))
  book?: Types.ObjectId | Book | null;

  status: TransactionsType;

  dueDate: Date;

  borrowDate: Date;

  timeStamp: Date;

  constructor(partial: Partial<TransactionEntity>) {
    super();
    Object.assign(this, partial);
  }
}
