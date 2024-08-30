import { IsNotEmpty, IsString } from "class-validator";

export class RoomDto {
  @IsNotEmpty()
  @IsString()
  th: string;

  @IsNotEmpty()
  @IsString()
  en: string;
}
