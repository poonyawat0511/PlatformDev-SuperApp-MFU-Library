import { TransformId } from "src/app/decorator/transform-id.decorator";
import { RenewStatus } from "../enums/renew-status.enum";
import { TransactionEntity } from "src/transactions/entities/transaction.entity";
import { MongoEntity } from "src/app/common/lib/mongo.entiy";
import { Transaction } from "src/transactions/schemas/transaction.schema";
import { Types } from "mongoose";

export class RenewEntity extends MongoEntity {
  @TransformId((v) => new TransactionEntity(v))
  transaction?: Types.ObjectId | Transaction | null;

  status: RenewStatus;

  constructor(partial: Partial<RenewEntity>) {
    super();
    Object.assign(this, partial);
  }
}
