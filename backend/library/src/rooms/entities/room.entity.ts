import { MongoEntity } from "src/app/common/lib/mongo.entiy";
import { RoomDto } from "../dto/room.dto";
import { RoomStatus, RoomType } from "../enums/room-status.enum";

export class RoomEntity extends MongoEntity {
  room: number;

  detail: RoomDto;

  status: RoomStatus;

  type: RoomType;

  constructor(partial: Partial<RoomEntity>) {
    super();
    Object.assign(this, partial);
  }
}
