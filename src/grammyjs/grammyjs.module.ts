import { Module } from '@nestjs/common';
import { GrammyjsService } from './grammyjs.service.js';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '../users/entities/user.entity.js';
import { Otp } from '../otp/entities/otp.entity.js';

@Module({ 
  imports: [
    ConfigModule.forRoot(),
    SequelizeModule.forFeature([User, Otp])
  ],
  providers: [GrammyjsService],
  exports: [GrammyjsService],
})
export class GrammyjsModule {}
