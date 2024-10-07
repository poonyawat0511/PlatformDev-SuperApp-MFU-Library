import {
  IsDateString,
  IsIn,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from "class-validator";
import { reservationType } from "../enums/reservation.enum";

export class CreateReservationDto {
  @IsNotEmpty()
  @IsMongoId()
  room: string;

  @IsNotEmpty()
  @IsMongoId()
  user: string;

  @IsString()
  @IsIn([
    reservationType.pending,
    reservationType.confirmed,
    reservationType.cancelled,
  ])
  type: reservationType;

  @IsOptional()
  @IsDateString()
  dateTime: Date;

  @IsNotEmpty()
  timeSlot: string;
}
