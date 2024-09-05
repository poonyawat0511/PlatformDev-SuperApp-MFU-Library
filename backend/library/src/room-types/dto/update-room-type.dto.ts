import { PartialType } from '@nestjs/swagger';
import { CreateRoomTypeDto } from './create-room-type.dto';

export class UpdateRoomTypeDto extends PartialType(CreateRoomTypeDto) {}
