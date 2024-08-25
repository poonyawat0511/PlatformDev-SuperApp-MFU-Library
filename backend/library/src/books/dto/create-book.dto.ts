import { Type } from "class-transformer";
import {
  IsIn,
  IsMongoId,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator";
import { BookDTO } from "./book.dto";
import { BookStatus } from "../enums/book-status.enum";

export class CreateBookDto {
  @IsObject()
  @ValidateNested()
  @Type(() => BookDTO)
  name: BookDTO;

  @IsObject()
  @ValidateNested()
  @Type(() => BookDTO)
  description: BookDTO;

  bookImage: string;

  @IsMongoId()
  @IsNotEmpty()
  category: string;

  @IsString()
  @IsIn(["READY", "NOT_READY"])
  status: BookStatus;
}