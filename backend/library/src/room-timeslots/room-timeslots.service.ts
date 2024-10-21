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
import { CreateRoomTimeslotDto } from "./dto/create-room-timeslot.dto";
import { UpdateRoomTimeslotDto } from "./dto/update-room-timeslot.dto";
import { RoomTimeSlot } from "./schemas/room-timeslot.schema";

const POPULATE_PIPE = [
  {
    path: "room",
    select: ["room", "type"],
    populate: {
      path: "type",
      select: ["name.en", "name.th"],
    },
  },
  {
    path: "timeSlot",
    select: ["start", "end"],
  },
];

@Injectable()
export class RoomTimeslotsService {
  private readonly errorBuilder = new ErrorBuilder("RoomTimeSlot");

  constructor(
    @InjectModel(RoomTimeSlot.name)
    private readonly roomTimeSlotModel: Model<RoomTimeSlot>
  ) {}

  async create(
    createRoomTimeslotDto: CreateRoomTimeslotDto
  ): Promise<RoomTimeSlot> {
    try {
      const roomTimeSlotDoc = new this.roomTimeSlotModel(createRoomTimeslotDto);
      const roomTimeSlot = await roomTimeSlotDoc.save();
      const populateRoomTimeSlot = await roomTimeSlot.populate(POPULATE_PIPE)
      return populateRoomTimeSlot.toObject();
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

  async findAll(): Promise<RoomTimeSlot[]> {
    const roomTimeSlot = await this.roomTimeSlotModel.find().populate(POPULATE_PIPE).lean();
    return roomTimeSlot;
  }

  async findOne(id: string): Promise<RoomTimeSlot> {
    try {
      const roomTimeSlot = await this.roomTimeSlotModel.findById(id).populate(POPULATE_PIPE).lean();
      if (!roomTimeSlot) {
        throw new NotFoundException(
          this.errorBuilder.build(ErrorMethod.notFound, { id })
        );
      }
      return roomTimeSlot;
    } catch (error) {
      throw error;
    }
  }

  async update(
    id: string,
    updateRoomTimeslotDto: UpdateRoomTimeslotDto
  ): Promise<RoomTimeSlot> {
    const exists = await this.roomTimeSlotModel.exists({ _id: id });
    try {
      if (!exists) {
        throw new NotFoundException(
          this.errorBuilder.build(ErrorMethod.notFound, { id })
        );
      }
      const options = { new: true };
      const roomTimeSlot = await this.roomTimeSlotModel
        .findByIdAndUpdate(id, updateRoomTimeslotDto, options).populate(POPULATE_PIPE)
        .lean();
      return roomTimeSlot;
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

  async remove(id: string): Promise<RoomTimeSlot> {
    const roomTimeSlot = await this.roomTimeSlotModel
      .findByIdAndDelete(id)
      .lean();
    if (!roomTimeSlot) {
      throw new NotFoundException(
        this.errorBuilder.build(ErrorMethod.notFound, { id })
      );
    }
    return roomTimeSlot;
  }
}
