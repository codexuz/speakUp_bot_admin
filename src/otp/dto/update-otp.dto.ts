import { PartialType } from '@nestjs/mapped-types';
import { CreateOtpDto } from './create-otp.dto.js';

export class UpdateOtpDto extends PartialType(CreateOtpDto) {}
