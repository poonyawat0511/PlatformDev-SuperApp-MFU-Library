import { MongoEntity } from "src/app/common/lib/mongo.entiy";

export class TimeslotEntity extends MongoEntity {
  start: string;

  end: string;
  constructor(partial: Partial<TimeslotEntity>) {
    super();
    Object.assign(this, partial);
  }
}
