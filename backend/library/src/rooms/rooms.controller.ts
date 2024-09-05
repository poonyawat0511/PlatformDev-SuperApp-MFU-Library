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
import { CreateRoomDto } from "./dto/create-room.dto";
import { UpdateRoomDto } from "./dto/update-room.dto";
import { RoomsService } from "./rooms.service";
import { RoomEntity } from "./entities/room.entity";

@Controller("rooms")
export class RoomsController {
  private readonly messageBuilder = new MessageBuilder("Rooms");
  constructor(private readonly roomsService: RoomsService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  async create(@Body() createRoomDto: CreateRoomDto) {
    const room = await this.roomsService.create(createRoomDto);
    return createResponse(
      HttpStatus.CREATED,
      this.messageBuilder.build(ResponseMethod.create),
      new RoomEntity(room)
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  async findAll() {
    const rooms = await this.roomsService.findAll();
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.findAll),
      rooms.map((room) => new RoomEntity(room))
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(":id")
  async findOne(@Param("id") id: string) {
    const room = await this.roomsService.findOne(id);
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.findOne, { id }),
      new RoomEntity(room)
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Patch(":id")
  async update(@Param("id") id: string, @Body() updateRoomDto: UpdateRoomDto) {
    const room = await this.roomsService.update(id, updateRoomDto);
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.update, { id }),
      new RoomEntity(room)
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Delete(":id")
  async remove(@Param("id") id: string) {
    const room = await this.roomsService.remove(id);
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.remove, { id }),
      new RoomEntity(room)
    );
  }
}
