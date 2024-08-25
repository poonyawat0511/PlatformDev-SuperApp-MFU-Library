import { IsNotEmpty, IsString } from "class-validator";

export class nameDTO {
  @IsNotEmpty()
  @IsString()
  th: string;

  @IsNotEmpty()
  @IsString()
  en: string;
}
