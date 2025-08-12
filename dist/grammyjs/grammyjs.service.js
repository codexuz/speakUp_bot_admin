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
import "@grammyjs/conversations";
import { Injectable } from '@nestjs/common';
import { ConfigService } from "@nestjs/config";
import { Bot, session, InlineKeyboard, Keyboard } from "grammy";
import { conversations, createConversation } from '@grammyjs/conversations';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../users/entities/user.entity.js';
import { Otp } from '../otp/entities/otp.entity.js';
import { generateOTP } from './config/index.js';
import { Op } from 'sequelize';
let GrammyjsService = class GrammyjsService {
    constructor(configService, userModel, otpModel) {
        this.configService = configService;
        this.userModel = userModel;
        this.otpModel = otpModel;
        const token = this.configService.get('BOT_TOKEN');
        this.bot = new Bot(token);
        this.bot.use(session({ initial: () => ({}) }));
        this.bot.use(conversations());
        this.bot.use(createConversation(this.registerConversation.bind(this), "registerConversation"));
        this.bot.command('start', async (ctx) => await ctx.conversation.enter("registerConversation"));
        this.bot.command("getotp", async (ctx) => {
            const telegramId = ctx.from.id.toString();
            try {
                const existingOtp = await this.otpModel.findOne({
                    where: {
                        telegram_id: telegramId,
                        isExpired: false,
                        expiration_date: {
                            [Op.gt]: new Date()
                        }
                    }
                });
                if (existingOtp) {
                    await ctx.reply(`⚠️ You already have an active session!\n\nYour current OTP *${existingOtp.otp_code}* is valid until *${existingOtp.expiration_date.toLocaleString()}*`, { parse_mode: "Markdown" });
                    return;
                }
                const otpCode = generateOTP();
                await this.saveOTP(telegramId, otpCode);
                await ctx.reply(`✅ Sizning OTP kodingiz: *${otpCode}*`, { parse_mode: "Markdown" });
            }
            catch (error) {
                await ctx.reply("❌ Error generating OTP. Please try again.");
            }
        });
        this.bot.on("callback_query:data", async (ctx) => {
            if (ctx.callbackQuery.data === "get_otp") {
                const telegramId = ctx.from.id.toString();
                try {
                    const existingOtp = await this.otpModel.findOne({
                        where: {
                            telegram_id: telegramId,
                            isExpired: false,
                            expiration_date: {
                                [Op.gt]: new Date()
                            }
                        }
                    });
                    await ctx.answerCallbackQuery();
                    if (existingOtp) {
                        await ctx.reply(`⚠️ You already have an active session!\n\nYour current OTP *${existingOtp.otp_code}* is valid until *${existingOtp.expiration_date.toLocaleString()}*`, {
                            parse_mode: "Markdown",
                            reply_markup: { remove_keyboard: true }
                        });
                        return;
                    }
                    const otpCode = generateOTP();
                    await this.saveOTP(telegramId, otpCode);
                    await ctx.reply(`🔢 Sizning OTP kodingiz *${otpCode}*`, {
                        parse_mode: "Markdown",
                        reply_markup: { remove_keyboard: true }
                    });
                }
                catch (error) {
                    await ctx.reply("❌ Error generating OTP. Please try again.");
                }
            }
        });
    }
    async registerConversation(conversation, ctx) {
        const telegramId = ctx.from.id.toString();
        const username = ctx.from.username || ctx.from.first_name;
        const name = ctx.from.first_name || 'No name';
        try {
            const existingUser = await this.findUserByTelegramId(telegramId);
            if (existingUser) {
                const inlineKeyboard = new InlineKeyboard().text("📩 Kod olish", "get_otp");
                await ctx.reply("✅ Siz allaqachon ro'yxatdan o'tgansiz. \n\n Kod olish uchun quyidagi tugmani bosing:", {
                    parse_mode: "Markdown",
                    reply_markup: inlineKeyboard
                });
                return;
            }
            const keyboard = new Keyboard().resized().requestContact("📱 Raqamni ulashish");
            await ctx.reply("Iltimos, telefon raqamingizni ulashing:", { reply_markup: keyboard });
            const { message: phoneMessage } = await conversation.wait();
            if (!phoneMessage.contact) {
                return ctx.reply("❌ Davom etish uchun telefon raqamingizni ulashing!");
            }
            const userWithPhone = await this.findUserByPhone(phoneMessage.contact.phone_number);
            if (userWithPhone) {
                return ctx.reply("❌ Bu telefon raqam allaqachon ro'yxatdan o'tgan. Boshqa raqam bilan qaytadan urinib ko'ring.", { reply_markup: { remove_keyboard: true } });
            }
            await this.registerUser(telegramId, username, name, phoneMessage.contact.phone_number);
            const inlineKeyboard = new InlineKeyboard().text("📩 Kod olish", "get_otp");
            await ctx.reply("✅ Ro'yxatdan muvaffaqiyatli o'tdingiz! \n\n Kod olish uchun quyidagi tugmani bosing:", {
                parse_mode: "Markdown",
                reply_markup: inlineKeyboard
            });
        }
        catch (error) {
            console.error("Registration error:", error);
            await ctx.reply("❌ Registration failed. Please try again.");
        }
    }
    async findUserByTelegramId(telegramId) {
        return this.userModel.findOne({
            where: {
                telegramId: telegramId
            }
        });
    }
    async findUserByPhone(phone) {
        return this.userModel.findOne({
            where: {
                phone: phone
            }
        });
    }
    async findUser(telegramId) {
        return this.findUserByTelegramId(telegramId);
    }
    async registerUser(telegramId, username, name, phone) {
        const normalizedPhone = phone.replace(/\s+/g, '').replace(/[+\-()]/g, '');
        return this.userModel.create({
            telegramId: telegramId,
            username: username,
            first_name: name,
            last_name: '',
            phone: normalizedPhone,
            balance: 0,
            avatar_url: "https://avatar.iran.liara.run/public",
            password_hash: '',
            is_active: true,
            role: "user"
        });
    }
    async saveOTP(telegramId, otpCode) {
        const expirationDate = new Date();
        expirationDate.setMonth(expirationDate.getMonth() + 1);
        return this.otpModel.create({
            telegram_id: telegramId,
            otp_code: otpCode,
            isExpired: false,
            expiration_date: expirationDate
        });
    }
    async hasActiveOTP(telegramId) {
        return this.otpModel.findOne({
            where: {
                telegram_id: telegramId,
                isExpired: false,
                expiration_date: {
                    [Op.gt]: new Date()
                }
            }
        });
    }
    async onModuleInit() {
        console.log('Starting Telegram bot...');
        await this.bot.start();
        console.log('Bot started successfully');
    }
};
GrammyjsService = __decorate([
    Injectable(),
    __param(1, InjectModel(User)),
    __param(2, InjectModel(Otp)),
    __metadata("design:paramtypes", [ConfigService, Object, Object])
], GrammyjsService);
export { GrammyjsService };
//# sourceMappingURL=grammyjs.service.js.map