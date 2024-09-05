import { MongoEntity } from "src/app/common/lib/mongo.entiy";
export class RoomTypeEntity extends MongoEntity {
  name: { th: string; en: string };

  constructor(partial: Partial<RoomTypeEntity>) {
    super();
    Object.assign(this, partial);
  }
}
