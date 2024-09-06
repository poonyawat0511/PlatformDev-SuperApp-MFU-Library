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
import { CreateTimeslotDto } from "./dto/create-timeslot.dto";
import { UpdateTimeslotDto } from "./dto/update-timeslot.dto";
import { TimeslotEntity } from "./entities/timeslot.entity";
import { TimeslotsService } from "./timeslots.service";

@Controller("timeslots")
export class TimeslotsController {
  private readonly messageBuilder = new MessageBuilder("Timeslots");

  constructor(private readonly timeslotsService: TimeslotsService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  async create(@Body() createTimeslotDto: CreateTimeslotDto) {
    const timeslot = await this.timeslotsService.create(createTimeslotDto);
    return createResponse(
      HttpStatus.CREATED,
      this.messageBuilder.build(ResponseMethod.create),
      new TimeslotEntity(timeslot)
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  async findAll() {
    const timeslots = await this.timeslotsService.findAll();
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.findAll),
      timeslots.map((timeslot) => new TimeslotEntity(timeslot))
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(":id")
  async findOne(@Param("id") id: string) {
    const timeslot = await this.timeslotsService.findOne(id);
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.findOne, { id }),
      new TimeslotEntity(timeslot)
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Patch(":id")
  async update(
    @Param("id") id: string,
    @Body() updateTimeslotDto: UpdateTimeslotDto
  ) {
    const timeslot = await this.timeslotsService.update(id, updateTimeslotDto);
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.update, { id }),
      new TimeslotEntity(timeslot)
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Delete(":id")
  async remove(@Param("id") id: string) {
    const timeslot = await this.timeslotsService.remove(id);
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.remove, { id }),
      new TimeslotEntity(timeslot)
    );
  }
}
