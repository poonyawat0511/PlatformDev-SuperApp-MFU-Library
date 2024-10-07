import {
  IsIn,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsString,
} from "class-validator";
import { RoomStatus } from "../enums/room-status.enum";
export class CreateRoomDto {
  @IsNotEmpty()
  @IsNumber()
  room: number;

  @IsNotEmpty()
  @IsNumber()
  floor: number;

  @IsString()
  @IsIn([RoomStatus.ready, RoomStatus.not_ready])
  status: RoomStatus;

  @IsMongoId()
  @IsNotEmpty()
  type: string;
}
