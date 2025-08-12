import { OtpService } from './otp.service.js';
import { CreateOtpDto } from './dto/create-otp.dto.js';
import { UpdateOtpDto } from './dto/update-otp.dto.js';
export declare class OtpController {
    private readonly service;
    constructor(service: OtpService);
    create(dto: CreateOtpDto): Promise<import("./entities/otp.entity.js").Otp>;
    findAll(): Promise<import("./entities/otp.entity.js").Otp[]>;
    findOne(id: string): Promise<import("./entities/otp.entity.js").Otp>;
    update(id: string, dto: UpdateOtpDto): Promise<import("./entities/otp.entity.js").Otp>;
    remove(id: string): Promise<void>;
}
