import {
  IsDateString,
  IsIn,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from "class-validator";
import { IsReturnDateAllowed } from "src/app/decorator/is-return-date.decorator";
import { TransactionsType } from "../enums/transactions-type.enum";

export class CreateTransactionDto {
  @IsNotEmpty()
  user: string;

  @IsNotEmpty()
  book: string;

  @IsString()
  @IsIn([TransactionsType.borrow, TransactionsType.return])
  status: TransactionsType;

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
