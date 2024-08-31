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
import { Reservation } from "./schemas/reservation.schema";
import { reservationType } from "./enums/reservation.enum";

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
    return reservation.save();
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
