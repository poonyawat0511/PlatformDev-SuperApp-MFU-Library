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
  @IsIn([RoomStatus.free, RoomStatus.reserved, RoomStatus.in_use])
  status: RoomStatus;

  @IsMongoId()
  @IsNotEmpty()
  type: string;
}
