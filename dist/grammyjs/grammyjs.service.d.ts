import "@grammyjs/conversations";
import { OnModuleInit } from '@nestjs/common';
import { ConfigService } from "@nestjs/config";
import { Context } from "grammy";
import { type Conversation } from '@grammyjs/conversations';
import { User } from '../users/entities/user.entity.js';
import { Otp } from '../otp/entities/otp.entity.js';
interface MyContext extends Context {
    conversation: {
        enter: (conversationId: string) => Promise<unknown>;
    };
}
export declare class GrammyjsService implements OnModuleInit {
    private configService;
    private userModel;
    private otpModel;
    private bot;
    constructor(configService: ConfigService, userModel: typeof User, otpModel: typeof Otp);
    registerConversation(conversation: Conversation<MyContext>, ctx: MyContext): Promise<import("@grammyjs/types").Message.TextMessage>;
    findUserByTelegramId(telegramId: string): Promise<User | null>;
    findUserByPhone(phone: string): Promise<User | null>;
    findUser(telegramId: string): Promise<User | null>;
    registerUser(telegramId: string, username: string, name: string, phone: string): Promise<User>;
    saveOTP(telegramId: string, otpCode: string): Promise<Otp>;
    hasActiveOTP(telegramId: string): Promise<Otp | null>;
    onModuleInit(): Promise<void>;
}
export {};
