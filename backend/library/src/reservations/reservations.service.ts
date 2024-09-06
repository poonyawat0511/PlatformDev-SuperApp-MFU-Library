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
import { Room } from "src/rooms/schemas/room.schema";
import { CreateReservationDto } from "./dto/create-reservation.dto";
import { UpdateReservationDto } from "./dto/update-reservation.dto";
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
    try {
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
    }
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
    try {
      if (!exists) {
        throw new NotFoundException(
          this.errorBuilder.build(ErrorMethod.notFound, { id })
        );
      }
      const options = { new: true };
      const reservation = await this.reservationModel
        .findByIdAndUpdate(id, updateReservationDto, options)
        .lean();
      return reservation;
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException(
          this.errorBuilder.build(ErrorMethod.duplicated, {
            action: RequestAction.update,
          })
        );
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
