import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { RoomTimeslotsController } from "./room-timeslots.controller";
import { RoomTimeslotsService } from "./room-timeslots.service";
import {
  RoomTimeSlot,
  RoomTimeSlotSchema,
} from "./schemas/room-timeslot.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: RoomTimeSlot.name, schema: RoomTimeSlotSchema },
    ]),
  ],
  controllers: [RoomTimeslotsController],
  providers: [RoomTimeslotsService],
  exports: [MongooseModule],
})
export class RoomTimeslotsModule {}
