import { IsObject, ValidateNested } from "class-validator";
import { nameDTO } from "./name.dto";
import { Type } from "class-transformer";

export class CreateBookCategoryDto {
  @IsObject()
  @ValidateNested()
  @Type(() => nameDTO)
  name: nameDTO;
}
