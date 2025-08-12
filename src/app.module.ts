import { Module } from '@nestjs/common';
import { AdminModule } from '@adminjs/nestjs';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';


import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';

/* Models   */

import { User } from './users/entities/user.entity.js';
import { Otp } from './otp/entities/otp.entity.js';

import { OtpModule } from './otp/otp.module.js';
import { GrammyjsModule } from './grammyjs/grammyjs.module.js';
import { UsersModule } from './users/users.module.js';



@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
     SequelizeModule.forRoot({
      dialect: "postgres",
      uri: "postgresql://postgres.bkxhwaeluswfwfxavmpt:Jackyshow_98@aws-0-ap-south-1.pooler.supabase.com:6543/postgres",
      sync: { force: false },
      models: [User, Otp],
      autoLoadModels: true,
      logging: true,
    }),
    
    UsersModule,
    OtpModule,
    GrammyjsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
