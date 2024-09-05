import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ErrorBuilder, ErrorMethod } from "src/app/common/utils/error.util";
import { RoomStatus } from "src/rooms/enums/room-status.enum";
import { Room } from "src/rooms/schemas/room.schema";
import { CreateReservationDto } from "./dto/create-reservation.dto";
import { UpdateReservationDto } from "./dto/update-reservation.dto";
import { reservationType } from "./enums/reservation.enum";
import { Reservation } from "./schemas/reservation.schema";

@Injectable()
export class ReservationsService {
  private readonly errorBuilder = new ErrorBuilder("Reservations");

  constructor(
    @InjectModel(Reservation.name)
    private readonly reservationModel: Model<Reservation>,
    @InjectModel(Room.name)
    private readonly roomModel: Model<Room>
  ) {}

  async create(
    createReservationDto: CreateReservationDto
  ): Promise<Reservation> {
    const { room: roomId, type } = createReservationDto;

    // Find the room
    const room = await this.roomModel.findById(roomId);
    if (!room) {
      throw new NotFoundException("Room not found");
    }

    // Handle reservation type
    if (type === reservationType.reserve) {
      if (room.status !== RoomStatus.free) {
        throw new BadRequestException("Room is not available for reservation");
      }
      // Update room status to 'reserved'
      room.status = RoomStatus.reserved;
    } else if (type === reservationType.return) {
      if (
        room.status !== RoomStatus.reserved &&
        room.status !== RoomStatus.in_use
      ) {
        throw new BadRequestException(
          "Room is not currently reserved or in use"
        );
      }
      // Update room status to 'free'
      room.status = RoomStatus.free;
    } else if (type === reservationType.in_use) {
      if (room.status !== RoomStatus.reserved) {
        throw new BadRequestException(
          "Room must be reserved before it can be in use"
        );
      }
      // Update room status to 'in use'
      room.status = RoomStatus.in_use;
    } else {
      throw new BadRequestException("Invalid reservation type");
    }

    // Save room status change
    await room.save();

    // Create the reservation
    const reservation = new this.reservationModel(createReservationDto);
    const savedReservation = await reservation.save();

    // Set a timeout for 15 minutes to revert the room status to 'free' and update reservation type to 'return'
    if (type === reservationType.reserve) {
      setTimeout(
        async () => {
          const updatedReservation = await this.reservationModel.findById(
            savedReservation._id
          );
          if (
            updatedReservation &&
            updatedReservation.type !== reservationType.in_use
          ) {
            // Update reservation type to 'return'
            updatedReservation.type = reservationType.return;
            await updatedReservation.save();

            // Revert room status to 'free'
            room.status = RoomStatus.free;
            await room.save();

            console.log(
              `Room ${roomId} status reverted to 'free' and reservation type changed to 'return' after 15 minutes`
            );
          }
        },
        // change 15 to 1 if want to test time
        15 * 60 * 1000 // Replace with 15 * 60 * 1000 for 15 minutes
      );
    }

    return savedReservation;
  }

  async findAll(): Promise<Reservation[]> {
    const reservation = await this.reservationModel.find().lean();
    return reservation;
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

  async update(
    id: string,
    updateReservationDto: UpdateReservationDto
  ): Promise<Reservation> {
    const exists = await this.reservationModel.exists({ _id: id });
    if (!exists) {
      throw new NotFoundException(
        this.errorBuilder.build(ErrorMethod.notFound, { id })
      );
    }

    const reservation = await this.reservationModel.findById(id);
    if (!reservation) {
      throw new NotFoundException("Reservation not found");
    }

    const { type, room: roomId } = updateReservationDto;

    // Find the room
    const room = await this.roomModel.findById(roomId);
    if (!room) {
      throw new NotFoundException("Room not found");
    }

    // Handle reservation type
    if (type === reservationType.return) {
      if (
        room.status !== RoomStatus.reserved &&
        room.status !== RoomStatus.in_use
      ) {
        throw new BadRequestException(
          "Room is not currently reserved or in use"
        );
      }
      // Update room status to 'free'
      room.status = RoomStatus.free;
    } else if (type === reservationType.in_use) {
      if (room.status !== RoomStatus.reserved) {
        throw new BadRequestException(
          "Room must be reserved before it can be in use"
        );
      }
      // Update room status to 'in use'
      room.status = RoomStatus.in_use;
    }

    // Save room status change
    await room.save();

    const options = { new: true };
    const updatedReservation = await this.reservationModel
      .findByIdAndUpdate(id, updateReservationDto, options)
      .lean();

    return updatedReservation;
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
