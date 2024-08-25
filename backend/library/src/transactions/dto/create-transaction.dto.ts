import {
  IsDateString,
  IsIn,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from "class-validator";
import { TransactionsType } from "../enums/transactions-type.enum";

export class CreateTransactionDto {
  @IsNotEmpty()
  @IsMongoId()
  user: string;

  @IsNotEmpty()
  @IsMongoId()
  book: string;

  @IsString()
  @IsIn(["BORROW", "RETURN", "IN_PROGRESS"])
  status: TransactionsType;

  @IsOptional()
  @IsDateString()
  dueDate: Date;

  @IsOptional()
  @IsDateString()
  timeStamp: Date;
}
