var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { GrammyjsService } from './grammyjs.service.js';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '../users/entities/user.entity.js';
import { Otp } from '../otp/entities/otp.entity.js';
let GrammyjsModule = class GrammyjsModule {
};
GrammyjsModule = __decorate([
    Module({
        imports: [
            ConfigModule.forRoot(),
            SequelizeModule.forFeature([User, Otp])
        ],
        providers: [GrammyjsService],
        exports: [GrammyjsService],
    })
], GrammyjsModule);
export { GrammyjsModule };
//# sourceMappingURL=grammyjs.module.js.map