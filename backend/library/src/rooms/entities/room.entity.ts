import { Types } from "mongoose";
import { MongoEntity } from "src/app/common/lib/mongo.entiy";
import { TransformId } from "src/app/decorator/transform-id.decorator";
import { RoomTypeEntity } from "src/room-types/entities/room-type.entity";
import { RoomType } from "src/room-types/schemas/room-type.schema";
import { RoomStatus } from "../enums/room-status.enum";

export class RoomEntity extends MongoEntity {
  room: number;

  floor: number;

  status: RoomStatus;

  @TransformId((v) => new RoomTypeEntity(v))
  type: Types.ObjectId | RoomType | null;

  constructor(partial: Partial<RoomEntity>) {
    super();
    Object.assign(this, partial);
  }
}
