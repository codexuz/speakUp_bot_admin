import { Model } from 'sequelize-typescript';
export declare class User extends Model<User> {
    id: string;
    username: string;
    password_hash: string;
    private _password?;
    set password(password: string);
    get password(): string | undefined;
    setPassword(password: string): Promise<void>;
    validatePassword(password: string): Promise<boolean>;
    static hashPassword(instance: User): Promise<void>;
    phone?: string;
    telegramId?: string;
    first_name: string;
    last_name: string;
    avatar_url: string;
    is_active: boolean;
    created_at: Date;
    last_login?: Date;
    balance: number;
    role: 'user' | 'admin' | 'teacher';
}
