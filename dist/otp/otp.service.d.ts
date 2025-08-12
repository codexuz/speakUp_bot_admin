import { Otp } from './entities/otp.entity.js';
import { CreateOtpDto } from './dto/create-otp.dto.js';
import { UpdateOtpDto } from './dto/update-otp.dto.js';
export declare class OtpService {
    private otpModel;
    constructor(otpModel: typeof Otp);
    create(createDto: CreateOtpDto): Promise<Otp>;
    findAll(): Promise<Otp[]>;
    findOne(id: string): Promise<Otp>;
    update(id: string, updateDto: UpdateOtpDto): Promise<Otp>;
    remove(id: string): Promise<void>;
}
