import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseInterceptors,
} from "@nestjs/common";
import {
  createResponse,
  MessageBuilder,
  ResponseMethod,
} from "src/app/common/utils/response.util";
import { CreateRoomTypeDto } from "./dto/create-room-type.dto";
import { UpdateRoomTypeDto } from "./dto/update-room-type.dto";
import { RoomTypeEntity } from "./entities/room-type.entity";
import { RoomTypesService } from "./room-types.service";

@Controller("room-types")
export class RoomTypesController {
  private readonly messageBuilder = new MessageBuilder("RoomTypes");

  constructor(private readonly roomTypesService: RoomTypesService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  async create(@Body() createRoomTypeDto: CreateRoomTypeDto) {
    const roomType = await this.roomTypesService.create(createRoomTypeDto);
    return createResponse(
      HttpStatus.CREATED,
      this.messageBuilder.build(ResponseMethod.create),
      new RoomTypeEntity(roomType)
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  async findAll() {
    const roomTypes = await this.roomTypesService.findAll();
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.findAll),
      roomTypes.map((roomType) => new RoomTypeEntity(roomType))
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(":id")
  async findOne(@Param("id") id: string) {
    const roomType = await this.roomTypesService.findOne(id);
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.findOne, { id }),
      new RoomTypeEntity(roomType)
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Patch(":id")
  async update(
    @Param("id") id: string,
    @Body() updateRoomTypeDto: UpdateRoomTypeDto
  ) {
    const roomType = await this.roomTypesService.update(id, updateRoomTypeDto);
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.update, { id }),
      new RoomTypeEntity(roomType)
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Delete(":id")
  async remove(@Param("id") id: string) {
    const roomType = await this.roomTypesService.remove(id);
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.remove, { id }),
      new RoomTypeEntity(roomType)
    );
  }
}
