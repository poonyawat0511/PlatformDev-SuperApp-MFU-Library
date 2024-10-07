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
import { Timeslot } from "src/timeslots/schemas/timeslot.schema";
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
    private readonly roomModel: Model<Room>,
    @InjectModel(RoomTimeSlot.name)
    private readonly roomTimeSlotModel: Model<RoomTimeSlot>
  ) {}

  // 1. Create reservation with default "pending" status
  async create(
    createReservationDto: CreateReservationDto
  ): Promise<Reservation> {
    try {
      // Set default reservation type to "pending"
      createReservationDto.type = reservationType.pending;

      // Find the RoomTimeSlot and update its status to "reserved"
      const { room, timeSlot } = createReservationDto;
      const roomTimeSlot = await this.roomTimeSlotModel
        .findOne({ room, timeSlot })
        .populate("timeSlot");

      if (!roomTimeSlot) {
        throw new NotFoundException("RoomTimeSlot not found");
      }

      if (roomTimeSlot.status !== RoomTimeSlotStatus.free) {
        throw new ConflictException("RoomTimeSlot is not available");
      }

      // Update RoomTimeSlot status to "reserved"
      roomTimeSlot.status = RoomTimeSlotStatus.reserved;
      await roomTimeSlot.save();

      // Create and save the reservation
      const reservationDoc = new this.reservationModel(createReservationDto);
      const reservation = await reservationDoc.save();

      // Schedule timeout based on Timeslot start time
      this.scheduleTimeout(
        reservation.id,
        room,
        timeSlot,
        roomTimeSlot.timeSlot as Timeslot
      );

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

  private async scheduleTimeout(
    reservationId: string,
    room: string,
    timeSlot: string,
    timeslot: Timeslot
  ) {
    const timeslotStartTime = this.convertTimeslotStartToTime(timeslot.start);
    const currentTime = new Date();

    // Log times for debugging
    console.log(`Timeslot start time: ${timeslotStartTime}`);
    console.log(`Current time: ${currentTime}`);

    // If the timeslot start time has already passed for today, schedule it for tomorrow
    if (currentTime >= timeslotStartTime) {
      console.log("Timeslot has passed for today, scheduling for tomorrow.");
      // Add 24 hours to the timeslot start time
      timeslotStartTime.setDate(timeslotStartTime.getDate() + 1);
    }

    // Calculate the delay: 15 minutes after the timeslot start time
    const delay =
      timeslotStartTime.getTime() + 1 * 60 * 1000 - currentTime.getTime();

    // Log delay for debugging
    console.log(`Calculated delay: ${delay} milliseconds`);

    if (delay > 0) {
      console.log(`Setting timeout for ${delay} milliseconds.`);

      setTimeout(async () => {
        console.log("Timeout triggered.");
        try {
          const currentReservation =
            await this.reservationModel.findById(reservationId);
          if (
            currentReservation &&
            currentReservation.type === reservationType.pending
          ) {
            // Update RoomTimeSlot status back to "free"
            const updatedRoomTimeSlot = await this.roomTimeSlotModel.findOne({
              room,
              timeSlot,
            });
            if (
              updatedRoomTimeSlot &&
              updatedRoomTimeSlot.status === RoomTimeSlotStatus.reserved
            ) {
              updatedRoomTimeSlot.status = RoomTimeSlotStatus.free;
              await updatedRoomTimeSlot.save();
              console.log(
                `RoomTimeSlot for room ${room} and timeSlot ${timeSlot} is now free.`
              );
            }

            // Update the reservation status to "cancelled"
            currentReservation.type = reservationType.cancelled;
            await currentReservation.save();
            console.log(`Reservation ${reservationId} is now cancelled.`);
          }
        } catch (error) {
          console.error("Error during timeout execution:", error);
        }
      }, delay);
    } else {
      console.log("Delay is not positive, timeout will not be set.");
    }
  }

  private convertTimeslotStartToTime(start: string): Date {
    // Convert time string "4:09" to a Date object
    const [hoursStr, minutesStr] = start.split(":").map((str) => str.trim());

    // Convert strings to numbers
    const hours = Number(hoursStr);
    const minutes = Number(minutesStr);

    // Validate the converted numbers
    if (
      isNaN(hours) ||
      isNaN(minutes) ||
      hours < 0 ||
      hours > 23 ||
      minutes < 0 ||
      minutes > 59
    ) {
      console.error(`Invalid timeslot start string: ${start}`);
      return new Date(NaN); // Return an invalid date
    }

    // Create a new Date object for the current date
    const now = new Date();
    now.setHours(hours);
    now.setMinutes(minutes);
    now.setSeconds(0);
    now.setMilliseconds(0);

    return now;
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
            1 * 60 * 1000 // 1 hour in milliseconds
          );
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
