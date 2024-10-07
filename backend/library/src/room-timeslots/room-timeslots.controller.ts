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
import { CreateRoomTimeslotDto } from "./dto/create-room-timeslot.dto";
import { UpdateRoomTimeslotDto } from "./dto/update-room-timeslot.dto";
import { RoomTimeSlotEntity } from "./entities/room-timeslot.entity";
import { RoomTimeslotsService } from "./room-timeslots.service";

@Controller("room-timeslots")
export class RoomTimeslotsController {
  private readonly messageBuilder = new MessageBuilder("RoomTimeSlots");

  constructor(private readonly roomTimeslotsService: RoomTimeslotsService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  async create(@Body() createRoomTimeslotDto: CreateRoomTimeslotDto) {
    const roomTimeSlot = await this.roomTimeslotsService.create(
      createRoomTimeslotDto
    );
    return createResponse(
      HttpStatus.CREATED,
      this.messageBuilder.build(ResponseMethod.create),
      new RoomTimeSlotEntity(roomTimeSlot)
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  async findAll() {
    const roomTimeSlots = await this.roomTimeslotsService.findAll();
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.findAll),
      roomTimeSlots.map((roomTimeSlot) => new RoomTimeSlotEntity(roomTimeSlot))
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(":id")
  async findOne(@Param("id") id: string) {
    const roomTimeSlot = await this.roomTimeslotsService.findOne(id);
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.findOne, { id }),
      new RoomTimeSlotEntity(roomTimeSlot)
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Patch(":id")
  async update(
    @Param("id") id: string,
    @Body() updateRoomTimeslotDto: UpdateRoomTimeslotDto
  ) {
    const roomTimeSlot = await this.roomTimeslotsService.update(
      id,
      updateRoomTimeslotDto
    );
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.update, { id }),
      new RoomTimeSlotEntity(roomTimeSlot)
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Delete(":id")
  async remove(@Param("id") id: string) {
    const roomTimeSlot = await this.roomTimeslotsService.remove(id);
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.remove, { id }),
      new RoomTimeSlotEntity(roomTimeSlot)
    );
  }
}
