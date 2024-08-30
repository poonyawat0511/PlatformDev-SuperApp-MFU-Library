import {
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsString,
  ValidateNested,
} from "class-validator";
import { RoomStatus, RoomType } from "../enums/room-status.enum";
import { Type } from "class-transformer";
import { RoomDto } from "./room.dto";

export class CreateRoomDto {
  @IsNotEmpty()
  @IsNumber()
  room: number;

  @IsObject()
  @ValidateNested()
  @Type(() => RoomDto)
  detail: RoomDto;

  @IsString()
  @IsIn([RoomStatus.ready, RoomStatus.not_ready])
  status: RoomStatus;

  @IsString()
  @IsIn([RoomType.study, RoomType.media])
  type: RoomType;
}
