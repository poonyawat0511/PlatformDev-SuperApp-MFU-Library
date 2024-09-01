import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, SchemaTypes, Types } from "mongoose";
import { Transaction } from "src/transactions/schemas/transaction.schema";
import { RenewStatus } from "../enums/renew-status.enum";

export type RenewDocument = HydratedDocument<Renew>;

@Schema()
export class Renew {
  @Prop({ type: SchemaTypes.ObjectId, ref: "Transaction", required: true })
  transaction: Transaction | Types.ObjectId;

  @Prop({
    type: String,
    enum: ["request", "approved", "rejected"],
    required: true, default:'request',
  })
  status: RenewStatus;
}
export const RenewSchema = SchemaFactory.createForClass(Renew);
RenewSchema.set("toJSON", { flattenObjectIds: true, versionKey: false });
RenewSchema.set("toObject", { flattenObjectIds: true, versionKey: false });
