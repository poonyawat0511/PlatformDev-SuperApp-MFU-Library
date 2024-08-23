import { Type } from "class-transformer";
import {
  IsNotEmpty,
  IsObject,
  IsOptional,
  ValidateNested,
} from "class-validator";
import { BookDTO } from "./book.dto";

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

  @IsObject()
  @ValidateNested()
  @Type(() => BookDTO)
  type: BookDTO;

  @IsOptional()
  @IsNotEmpty()
  quantity: number;
}
