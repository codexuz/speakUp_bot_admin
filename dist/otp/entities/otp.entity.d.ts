import { Model } from "sequelize-typescript";
export declare class Otp extends Model<Otp> {
    id: string;
    telegram_id: string;
    otp_code: string;
    isExpired: boolean;
    expiration_date: Date;
    created_at: Date;
}
