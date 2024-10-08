import { IsString, IsEmail, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @IsString()
  readonly username: string;

  @IsEmail()
  readonly email: string;

  @IsString()
  @MinLength(6)
  readonly newPassword: string;
}
