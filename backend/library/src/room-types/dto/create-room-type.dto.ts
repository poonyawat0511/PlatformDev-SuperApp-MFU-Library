import { Type } from "class-transformer";
import { IsObject, ValidateNested } from "class-validator";
import { nameDTO } from "./name.dto";

export class CreateRoomTypeDto {
  @IsObject()
  @ValidateNested()
  @Type(() => nameDTO)
  name: nameDTO;
}
