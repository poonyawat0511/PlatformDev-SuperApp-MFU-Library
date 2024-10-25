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
import { CreateRoomDto } from "./dto/create-room.dto";
import { UpdateRoomDto } from "./dto/update-room.dto";
import { Room } from "./schemas/room.schema";

const POPULATE_PIPE = [
  {
    path: "type",
    select: ["name.th", "name.en"],
  },
];
@Injectable()
export class RoomsService {
  private readonly errorBuilder = new ErrorBuilder("Rooms");

  constructor(
    @InjectModel(Room.name)
    private readonly roomModel: Model<Room>
  ) {}

  async create(createRoomDto: CreateRoomDto): Promise<Room> {
    try {
      const roomDoc = new this.roomModel(createRoomDto);
      const room = await roomDoc.save();
      const populateRoom = await room.populate(POPULATE_PIPE)
      return populateRoom.toObject();
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

  async findAll(): Promise<Room[]> {
    const room = await this.roomModel.find().populate(POPULATE_PIPE).lean();
    return room;
  }

  async findOne(id: string): Promise<Room> {
    try {
      const room = await this.roomModel
        .findById(id)
        .populate(POPULATE_PIPE)
        .lean();
      if (!room) {
        throw new NotFoundException(
          this.errorBuilder.build(ErrorMethod.notFound, { id })
        );
      }
      return room;
    } catch (error) {
      throw error;
    }
  }

  async update(id: string, updateRoomDto: UpdateRoomDto): Promise<Room> {
    const exists = await this.roomModel.exists({ _id: id });
    try {
      if (!exists) {
        throw new NotFoundException(
          this.errorBuilder.build(ErrorMethod.notFound, { id })
        );
      }
      const options = { new: true };
      const room = await this.roomModel
        .findByIdAndUpdate(id, updateRoomDto, options).populate(POPULATE_PIPE)
        .lean();
      return room;
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

  async remove(id: string): Promise<Room> {
    const room = await this.roomModel.findByIdAndDelete(id).lean();
    if (!room) {
      throw new NotFoundException(
        this.errorBuilder.build(ErrorMethod.notFound, { id })
      );
    }
    return room;
  }
}
