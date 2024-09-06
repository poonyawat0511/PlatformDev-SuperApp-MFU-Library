import { PartialType } from '@nestjs/swagger';
import { CreateTimeslotDto } from './create-timeslot.dto';

export class UpdateTimeslotDto extends PartialType(CreateTimeslotDto) {}
