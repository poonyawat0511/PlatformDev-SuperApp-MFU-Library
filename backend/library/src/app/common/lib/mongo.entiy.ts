import { Exclude, Expose } from 'class-transformer';
import { Types } from 'mongoose';
import { TransformId } from 'src/app/decorator/transform-id.decorator';

export abstract class MongoEntity {
  @Expose({ name: 'id' })
  @TransformId((v) => {
    return v._id.toString();
  })
  _id: string | Types.ObjectId;

  @Exclude()
  __v: string;
}
