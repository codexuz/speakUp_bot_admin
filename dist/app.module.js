var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { User } from './users/entities/user.entity.js';
import { Otp } from './otp/entities/otp.entity.js';
import { OtpModule } from './otp/otp.module.js';
import { GrammyjsModule } from './grammyjs/grammyjs.module.js';
import { UsersModule } from './users/users.module.js';
let AppModule = class AppModule {
};
AppModule = __decorate([
    Module({
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
], AppModule);
export { AppModule };
//# sourceMappingURL=app.module.js.map