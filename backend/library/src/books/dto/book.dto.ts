import { IsNotEmpty, IsString } from "class-validator";

export class BookDTO {
  @IsNotEmpty()
  @IsString()
  th: string;

  @IsNotEmpty()
  @IsString()
  en: string;
}
