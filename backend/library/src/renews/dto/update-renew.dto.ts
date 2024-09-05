import { PartialType } from '@nestjs/swagger';
import { CreateRenewDto } from './create-renew.dto';

export class UpdateRenewDto extends PartialType(CreateRenewDto) {}
