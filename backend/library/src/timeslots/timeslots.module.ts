import { Module } from "@nestjs/common";
import { TimeslotsService } from "./timeslots.service";
import { TimeslotsController } from "./timeslots.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { Timeslot, TimeslotSchema } from "./schemas/timeslot.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Timeslot.name, schema: TimeslotSchema },
    ]),
  ],
  controllers: [TimeslotsController],
  providers: [TimeslotsService],
  exports: [MongooseModule],
})
export class TimeslotsModule {}
