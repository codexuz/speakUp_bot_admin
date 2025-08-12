import { IsString, IsNotEmpty, IsBoolean, IsDateString } from 'class-validator';

export class CreateOtpDto {
  @IsString()
  @IsNotEmpty()
  telegram_id: string;

  @IsString()
  @IsNotEmpty()
  otp_code: string;

  @IsBoolean()
  isExpired: boolean;

  @IsDateString()
  expiration_date: Date;
}
