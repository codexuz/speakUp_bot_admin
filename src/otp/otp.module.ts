import { Module } from '@nestjs/common';
import { OtpService } from './otp.service.js';
import { OtpController } from './otp.controller.js';
import { SequelizeModule } from '@nestjs/sequelize';
import { Otp } from './entities/otp.entity.js';
@Module({
  imports: [SequelizeModule.forFeature([Otp])],
  controllers: [OtpController],
  providers: [OtpService],
})
export class OtpModule {}
