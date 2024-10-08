import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class LocalesDto {
  @IsString()
  @IsNotEmpty()
  th: string;

  @IsString()
  @IsNotEmpty()
  en: string;
}

export class OptionalLocalesDto {
  @IsOptional()
  @IsString()
  th: string;

  @IsOptional()
  @IsString()
  en: string;
}
