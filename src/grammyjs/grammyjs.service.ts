import "@grammyjs/conversations";
import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from "@nestjs/config";
import { Bot, Context, session, InlineKeyboard, Keyboard } from "grammy";
import { conversations, createConversation, type Conversation } from '@grammyjs/conversations';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../users/entities/user.entity.js';
import { Otp } from '../otp/entities/otp.entity.js';
import { generateOTP } from './config/index.js';
import { Op } from 'sequelize';

// Define the context type with proper conversation flavor
interface MyContext extends Context {
      conversation: {
        enter: (conversationId: string) => Promise<unknown>;
      };
}

@Injectable()
export class GrammyjsService implements OnModuleInit {
  private bot: Bot<MyContext>;

  constructor(
    private configService: ConfigService,
    @InjectModel(User)
    private userModel: typeof User,
    @InjectModel(Otp)
    private otpModel: typeof Otp
  ) {
    const token = this.configService.get<string>('BOT_TOKEN');
    this.bot = new Bot<MyContext>(token);

    // Setup middleware
    this.bot.use(session({ initial: () => ({}) }));
    this.bot.use(conversations());
    
    // Register the conversation handler
    this.bot.use(createConversation(this.registerConversation.bind(this), "registerConversation"));
    
    // Set up commands
    this.bot.command('start', async (ctx) => await ctx.conversation.enter("registerConversation"));
    
    this.bot.command("getotp", async (ctx) => {
      const telegramId = ctx.from.id.toString();
      try {
        // Check for existing active OTP before generating a new one
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
          // If they already have an active OTP, notify them and don't create a new one
          await ctx.reply(
            `⚠️ You already have an active session!\n\nYour current OTP *${existingOtp.otp_code}* is valid until *${existingOtp.expiration_date.toLocaleString()}*`, 
            { parse_mode: "Markdown" }
          );
          return; // Exit early - don't generate a new OTP
        }
        
        // Only generate a new OTP if there isn't an active one
        const otpCode = generateOTP();
        await this.saveOTP(telegramId, otpCode);
        await ctx.reply(`✅ Sizning OTP kodingiz: *${otpCode}*`, { parse_mode: "Markdown" });
      } catch (error) {
        await ctx.reply("❌ Error generating OTP. Please try again.");
      }
    });

    // Handle callback queries
    this.bot.on("callback_query:data", async (ctx) => {
      if (ctx.callbackQuery.data === "get_otp") {
        const telegramId = ctx.from.id.toString();
        try {
          // Check for existing active OTP before generating a new one
          const existingOtp = await this.otpModel.findOne({
            where: {
              telegram_id: telegramId,
              isExpired: false,
              expiration_date: {
                [Op.gt]: new Date()
              }
            }
          });
          
          await ctx.answerCallbackQuery(); // Always acknowledge the callback query
          
          if (existingOtp) {
            // If they already have an active OTP, notify them and don't create a new one
            await ctx.reply(
              `⚠️ You already have an active session!\n\nYour current OTP *${existingOtp.otp_code}* is valid until *${existingOtp.expiration_date.toLocaleString()}*`, 
              { 
                parse_mode: "Markdown",
                reply_markup: { remove_keyboard: true }  
              }
            );
            return; // Exit early - don't generate a new OTP
          }
          
          // Only generate a new OTP if there isn't an active one
          const otpCode = generateOTP();
          await this.saveOTP(telegramId, otpCode);
          await ctx.reply(`🔢 Sizning OTP kodingiz *${otpCode}*`, { 
            parse_mode: "Markdown", 
            reply_markup: { remove_keyboard: true } 
          });
        } catch (error) {
          await ctx.reply("❌ Error generating OTP. Please try again.");
        }
      }
    });
  }

  async registerConversation(conversation: Conversation<MyContext>, ctx: MyContext) {
    const telegramId = ctx.from.id.toString();
    const username = ctx.from.username || ctx.from.first_name;
    const name = ctx.from.first_name || 'No name';

    try {
      // Check if the user is already registered using telegramId
      const existingUser = await this.findUserByTelegramId(telegramId);
      
      if (existingUser) {
        // User already exists - prevent registration and show OTP button
        const inlineKeyboard = new InlineKeyboard().text("📩 Kod olish", "get_otp");
        await ctx.reply(
          "✅ Siz allaqachon ro'yxatdan o'tgansiz. \n\n Kod olish uchun quyidagi tugmani bosing:",
          {
            parse_mode: "Markdown",
            reply_markup: inlineKeyboard
          }
        );
        return; // Exit early to prevent re-registration
      }
      
      // If we reach here, the user is not registered
      // Request phone number
      const keyboard = new Keyboard().resized().requestContact("📱 Raqamni ulashish");
      await ctx.reply("Iltimos, telefon raqamingizni ulashing:", { reply_markup: keyboard });

      // Wait for user response
      const { message: phoneMessage } = await conversation.wait();

      if (!phoneMessage.contact) {
        return ctx.reply("❌ Davom etish uchun telefon raqamingizni ulashing!");
      }

      // Check if the phone number is already registered
      const userWithPhone = await this.findUserByPhone(phoneMessage.contact.phone_number);
      if (userWithPhone) {
        return ctx.reply("❌ Bu telefon raqam allaqachon ro'yxatdan o'tgan. Boshqa raqam bilan qaytadan urinib ko'ring.", 
          { reply_markup: { remove_keyboard: true } }
        );
      }

      // Register the new user
      await this.registerUser(telegramId, username, name, phoneMessage.contact.phone_number);
      const inlineKeyboard = new InlineKeyboard().text("📩 Kod olish", "get_otp");
      
      await ctx.reply(
        "✅ Ro'yxatdan muvaffaqiyatli o'tdingiz! \n\n Kod olish uchun quyidagi tugmani bosing:",
        {
          parse_mode: "Markdown",
          reply_markup: inlineKeyboard
        }
      );
    } catch (error) {
      console.error("Registration error:", error);
      await ctx.reply("❌ Registration failed. Please try again.");
    }
  }

  // Helper methods for user operations
  async findUserByTelegramId(telegramId: string): Promise<User | null> {
    return this.userModel.findOne({ 
      where: { 
        telegramId: telegramId 
      } 
    });
  }
  
  async findUserByPhone(phone: string): Promise<User | null> {
    return this.userModel.findOne({ 
      where: { 
        phone: phone 
      } 
    });
  }
  
  async findUser(telegramId: string): Promise<User | null> {
    // Keep this method for backward compatibility
    return this.findUserByTelegramId(telegramId);
  }

  async registerUser(telegramId: string, username: string, name: string, phone: string): Promise<User> {
    // Normalize phone number - remove spaces and special characters
    const normalizedPhone = phone.replace(/\s+/g, '').replace(/[+\-()]/g, '');
    
    return this.userModel.create({
      telegramId: telegramId,
      username: username,
      first_name: name,
      last_name: '',
      phone: normalizedPhone,
      balance: 0,
      avatar_url: "https://avatar.iran.liara.run/public",
      password_hash: '', // Use proper password handling in production
      is_active: true,
      role: "user"
    });
  }

  // Helper method for OTP operations
  async saveOTP(telegramId: string, otpCode: string): Promise<Otp> {
    // Note: We now check for existing OTPs in the command handlers
    // and only call this method if we need to create a new OTP
    
    // Create a new OTP with 1 month expiration
    const expirationDate = new Date();
    expirationDate.setMonth(expirationDate.getMonth() + 1); // OTP expires in 1 month
    
    return this.otpModel.create({
      telegram_id: telegramId,
      otp_code: otpCode,
      isExpired: false,
      expiration_date: expirationDate
    });
  }
  
  // Helper to check if a user has an active OTP
  async hasActiveOTP(telegramId: string): Promise<Otp | null> {
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
}
