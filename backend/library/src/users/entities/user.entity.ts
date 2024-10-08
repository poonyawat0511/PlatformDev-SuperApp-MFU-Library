import { MongoEntity } from 'src/app/common/lib/mongo.entiy';

export class UserEntity extends MongoEntity {
  email: string;

  password: string;

  username: string;

  constructor(partial: Partial<UserEntity>) {
    super();
    Object.assign(this, partial);
  }
}
