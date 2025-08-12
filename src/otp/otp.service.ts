import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Otp } from './entities/otp.entity.js';
import { CreateOtpDto } from './dto/create-otp.dto.js';
import { UpdateOtpDto } from './dto/update-otp.dto.js';

@Injectable()
export class OtpService {
  constructor(
    @InjectModel(Otp)
    private otpModel: typeof Otp,
  ) {}

  async create(createDto: CreateOtpDto): Promise<Otp> {
    return this.otpModel.create(createDto);
  }

  async findAll(): Promise<Otp[]> {
    return this.otpModel.findAll();
  }

  async findOne(id: string): Promise<Otp> {
    const otp = await this.otpModel.findByPk(id);
    if (!otp) throw new NotFoundException('OTP not found');
    return otp;
  }

  async update(id: string, updateDto: UpdateOtpDto): Promise<Otp> {
    const otp = await this.findOne(id);
    await otp.update(updateDto);
    return otp;
  }

  async remove(id: string): Promise<void> {
    const otp = await this.findOne(id);
    await otp.destroy();
  }
}
