import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OtpService } from './otp.service.js';
import { CreateOtpDto } from './dto/create-otp.dto.js';
import { UpdateOtpDto } from './dto/update-otp.dto.js';

@Controller('otp')
export class OtpController {
  constructor(private readonly service: OtpService) {}

  @Post()
  create(@Body() dto: CreateOtpDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateOtpDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
