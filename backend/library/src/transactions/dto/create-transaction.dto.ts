import {
  IsDateString,
  IsIn,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from "class-validator";
import { TransactionsStatus } from "../enums/transactions-status.enum";
import { IsReturnDateAllowed } from "src/app/decorator/is-return-date.decorator";

export class CreateTransactionDto {
  @IsNotEmpty()
  @IsMongoId()
  user: string;

  @IsNotEmpty()
  @IsMongoId()
  book: string;

  @IsString()
  @IsIn([TransactionsStatus.borrow, TransactionsStatus.return])
  status: TransactionsStatus;

  @IsOptional()
  @IsDateString()
  dueDate: Date;

  @IsOptional()
  @IsDateString()
  borrowDate: Date;

  @IsOptional()
  @IsDateString()
  @IsReturnDateAllowed()
  returnDate: Date;
}
