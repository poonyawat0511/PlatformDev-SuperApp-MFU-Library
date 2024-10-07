import { forwardRef, Module } from "@nestjs/common";
import { ReservationsService } from "./reservations.service";
import { ReservationsController } from "./reservations.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { Reservation, ReservationSchema } from "./schemas/reservation.schema";
import { RoomsModule } from "src/rooms/rooms.module";
import { RoomTimeslotsModule } from "src/room-timeslots/room-timeslots.module";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Reservation.name, schema: ReservationSchema },
    ]),
    forwardRef(() => RoomsModule),
    forwardRef(() => RoomTimeslotsModule),
  ],
  controllers: [ReservationsController],
  providers: [ReservationsService],
  exports: [MongooseModule],
})
export class ReservationsModule {}
