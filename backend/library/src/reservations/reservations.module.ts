import { forwardRef, Module } from "@nestjs/common";
import { ReservationsService } from "./reservations.service";
import { ReservationsController } from "./reservations.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { Reservation, ReservationSchema } from "./schemas/reservation.schema";
import { RoomsModule } from "src/rooms/rooms.module";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Reservation.name, schema: ReservationSchema },
    ]),
    forwardRef(() => RoomsModule),
  ],
  controllers: [ReservationsController],
  providers: [ReservationsService],
  exports: [MongooseModule],
})
export class ReservationsModule {}
