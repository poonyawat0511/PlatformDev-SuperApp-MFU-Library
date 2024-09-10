import { Type } from "class-transformer";
import {
  IsIn,
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

  @IsString()
  @IsNotEmpty()
  ISBN: string;

  bookImage: string;

  @IsNotEmpty()
  @IsOptional()
  category: string;

  @IsString()
  @IsIn(["ready", "not ready"])
  status: BookStatus;

  @IsOptional()
  @IsNotEmpty()
  quantity: number;
}
