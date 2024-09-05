import {
  IsDateString,
  IsIn,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from "class-validator";
import { IsReturnDateAllowed } from "src/app/decorator/is-return-date.decorator";
import { reservationType } from "../enums/reservation.enum";

export class CreateReservationDto {
  @IsNotEmpty()
  @IsMongoId()
  room: string;

  @IsNotEmpty()
  @IsMongoId()
  user: string;

  @IsString()
  @IsIn([reservationType.reserve, reservationType.return,reservationType.in_use])
  type: reservationType;

  @IsOptional()
  @IsDateString()
  dueTime: Date;

  @IsOptional()
  @IsDateString()
  reserveTime: Date;

  @IsOptional()
  @IsDateString()
  @IsReturnDateAllowed()
  returnTime: Date;
}
