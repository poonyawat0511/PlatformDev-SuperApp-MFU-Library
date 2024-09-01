import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { RenewsController } from "./renews.controller";
import { RenewsService } from "./renews.service";
import { Renew, RenewSchema } from "./schemas/renew.schema";
import { TransactionsModule } from "src/transactions/transactions.module";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Renew.name, schema: RenewSchema }]),
    TransactionsModule,
  ],
  controllers: [RenewsController],
  providers: [RenewsService],
  exports: [MongooseModule],
})
export class RenewsModule {}
