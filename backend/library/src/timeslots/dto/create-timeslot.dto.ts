import { IsNotEmpty, IsString } from "class-validator";

export class CreateTimeslotDto {
  @IsNotEmpty()
  @IsString()
  start: string;

  @IsNotEmpty()
  @IsString()
  end: string;
}
