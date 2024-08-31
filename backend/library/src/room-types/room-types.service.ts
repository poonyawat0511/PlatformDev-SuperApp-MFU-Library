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
import { CreateRoomTypeDto } from "./dto/create-room-type.dto";
import { UpdateRoomTypeDto } from "./dto/update-room-type.dto";
import { RoomType } from "./schemas/room-type.schema";

@Injectable()
export class RoomTypesService {
  private readonly errorBuilder = new ErrorBuilder("Room-types");

  constructor(
    @InjectModel(RoomType.name)
    private readonly roomTypeModel: Model<RoomType>
  ) {}

  async create(createRoomTypeDto: CreateRoomTypeDto): Promise<RoomType> {
    try {
      const roomTypeDoc = new this.roomTypeModel(createRoomTypeDto);
      const roomType = await roomTypeDoc.save();
      return roomType.toObject();
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

  async findAll(): Promise<RoomType[]> {
    const roomType = await this.roomTypeModel.find().lean();
    return roomType;
  }

  async findOne(id: string): Promise<RoomType> {
    try {
      const roomType = await this.roomTypeModel.findById(id).lean();
      if (!roomType) {
        throw new NotFoundException(
          this.errorBuilder.build(ErrorMethod.notFound, { id })
        );
      }
      return roomType;
    } catch (error) {
      throw error;
    }
  }

  async update(
    id: string,
    updateRoomTypeDto: UpdateRoomTypeDto
  ): Promise<RoomType> {
    const exists = await this.roomTypeModel.exists({ _id: id });
    try {
      if (!exists) {
        throw new NotFoundException(
          this.errorBuilder.build(ErrorMethod.notFound, { id })
        );
      }
      const options = { new: true };
      const roomType = await this.roomTypeModel
        .findByIdAndUpdate(id, updateRoomTypeDto, options)
        .lean();
      return roomType;
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

  async remove(id: string): Promise<RoomType> {
    const roomType = await this.roomTypeModel.findByIdAndDelete(id).lean();
    if (!roomType) {
      throw new NotFoundException(
        this.errorBuilder.build(ErrorMethod.notFound, { id })
      );
    }
    return roomType;
  }
}
