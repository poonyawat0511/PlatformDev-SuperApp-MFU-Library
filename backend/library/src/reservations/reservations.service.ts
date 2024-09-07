import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import {
  ErrorBuilder,
  ErrorMethod,
  RequestAction,
} from "src/app/common/utils/error.util";
import { RoomTimeSlotStatus } from "src/room-timeslots/enums/room-timeslot.enum"; // Import RoomTimeSlotStatus enum
import { RoomTimeSlot } from "src/room-timeslots/schemas/room-timeslot.schema";
import { Room } from "src/rooms/schemas/room.schema";
import { CreateReservationDto } from "./dto/create-reservation.dto";
import { UpdateReservationDto } from "./dto/update-reservation.dto";
import { reservationType } from "./enums/reservation.enum";
import { Reservation } from "./schemas/reservation.schema";
// Assumed the enum location

@Injectable()
export class ReservationsService {
  private readonly errorBuilder = new ErrorBuilder("Reservations");

  constructor(
    @InjectModel(Reservation.name)
    private readonly reservationModel: Model<Reservation>,
    @InjectModel(Room.name)
    private readonly roomModel: Model<Room>,
    @InjectModel(RoomTimeSlot.name)
    private readonly roomTimeSlotModel: Model<RoomTimeSlot>
  ) {}

  // 1. Create reservation with default "pending" status
  async create(
    createReservationDto: CreateReservationDto
  ): Promise<Reservation> {
    try {
      // Ensure status defaults to "pending"
      createReservationDto.type = reservationType.pending;

      // 2. Find the RoomTimeSlot and update its status to "reserved"
      const { room, timeSlot } = createReservationDto;
      const roomTimeSlot = await this.roomTimeSlotModel.findOne({
        room,
        timeSlot,
      });
      if (!roomTimeSlot) {
        throw new NotFoundException("RoomTimeSlot not found");
      }

      if (roomTimeSlot.status !== RoomTimeSlotStatus.free) {
        throw new ConflictException("RoomTimeSlot is not available");
      }

      // Assign status using the enum
      roomTimeSlot.status = RoomTimeSlotStatus.reserved;
      await roomTimeSlot.save();

      // Create and save the reservation
      const reservationDoc = new this.reservationModel(createReservationDto);
      const reservation = await reservationDoc.save();

      return reservation.toObject();
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException(
          this.errorBuilder.build(ErrorMethod.duplicated, {
            action: RequestAction.create,
          })
        );
      }
      throw error;
    }
  }

  async findAll(): Promise<Reservation[]> {
    const reservations = await this.reservationModel.find().lean();
    return reservations;
  }

  async findOne(id: string): Promise<Reservation> {
    try {
      const reservation = await this.reservationModel.findById(id).lean();
      if (!reservation) {
        throw new NotFoundException(
          this.errorBuilder.build(ErrorMethod.notFound, { id })
        );
      }
      return reservation;
    } catch (error) {
      throw error;
    }
  }

  // 3 & 4. Update reservation status and RoomTimeSlot accordingly
  async update(
    id: string,
    updateReservationDto: UpdateReservationDto
  ): Promise<Reservation> {
    const reservation = await this.reservationModel.findById(id);
    if (!reservation) {
      throw new NotFoundException(`Reservation with id ${id} not found`);
    }

    try {
      const { type } = updateReservationDto;
      const { room, timeSlot } = reservation;

      // Handle status change to "confirmed"
      if (
        reservation.type === reservationType.pending &&
        type === reservationType.confirmed
      ) {
        const roomTimeSlot = await this.roomTimeSlotModel.findOne({
          room,
          timeSlot,
        });
        if (roomTimeSlot.status === RoomTimeSlotStatus.reserved) {
          roomTimeSlot.status = RoomTimeSlotStatus.in_use;
          await roomTimeSlot.save();

          // Start a countdown of 1 hour to set RoomTimeSlot back to "free"
          setTimeout(
            async () => {
              roomTimeSlot.status = RoomTimeSlotStatus.free;
              await roomTimeSlot.save();
              console.log(
                `RoomTimeSlot for room ${room} and timeSlot ${timeSlot} is now free`
              );
            },
            1 * 60 * 1000
          ); // 1 hour in milliseconds
        }
      }

      // Handle status change to "cancelled"
      if (
        reservation.type === reservationType.pending &&
        type === reservationType.cancelled
      ) {
        const roomTimeSlot = await this.roomTimeSlotModel.findOne({
          room,
          timeSlot,
        });
        if (roomTimeSlot.status === RoomTimeSlotStatus.reserved) {
          roomTimeSlot.status = RoomTimeSlotStatus.free;
          await roomTimeSlot.save();
        }
      }

      const updatedReservation = await this.reservationModel
        .findByIdAndUpdate(id, updateReservationDto, { new: true })
        .lean();
      return updatedReservation;
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException("Duplicate data error");
      }
      throw error;
    }
  }

  async remove(id: string): Promise<Reservation> {
    const reservation = await this.reservationModel
      .findByIdAndDelete(id)
      .lean();
    if (!reservation) {
      throw new NotFoundException(
        this.errorBuilder.build(ErrorMethod.notFound, { id })
      );
    }
    return reservation;
  }
}
