import { IsIn, IsMongoId, IsNotEmpty, IsOptional } from "class-validator";
import { RenewStatus } from "../enums/renew-status.enum";

export class CreateRenewDto {
  @IsMongoId()
  @IsNotEmpty()
  transaction: string;

  @IsOptional()
  @IsIn([RenewStatus.request, RenewStatus.approved, RenewStatus.rejected])
  status: RenewStatus;
}
