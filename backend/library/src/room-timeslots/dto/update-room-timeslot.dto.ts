import { PartialType } from '@nestjs/swagger';
import { CreateRoomTimeslotDto } from './create-room-timeslot.dto';

export class UpdateRoomTimeslotDto extends PartialType(CreateRoomTimeslotDto) {}
