var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './entities/user.entity.js';
let UsersService = class UsersService {
    constructor(userModel) {
        this.userModel = userModel;
    }
    async create(createUserDto) {
        const user = new User();
        user.username = createUserDto.username;
        user.first_name = createUserDto.first_name;
        user.last_name = createUserDto.last_name;
        user.password = createUserDto.password;
        await user.save();
        return user;
    }
    async findAll() {
        return this.userModel.findAll();
    }
    async findOne(id) {
        const user = await this.userModel.findByPk(id);
        if (!user)
            throw new NotFoundException('User not found');
        return user;
    }
    async update(id, updateUserDto) {
        const user = await this.findOne(id);
        if (updateUserDto.password) {
            user.password = updateUserDto.password;
        }
        Object.assign(user, updateUserDto);
        await user.save();
        return user;
    }
    async remove(id) {
        const user = await this.findOne(id);
        await user.destroy();
    }
};
UsersService = __decorate([
    Injectable(),
    __param(0, InjectModel(User)),
    __metadata("design:paramtypes", [Object])
], UsersService);
export { UsersService };
//# sourceMappingURL=users.service.js.map