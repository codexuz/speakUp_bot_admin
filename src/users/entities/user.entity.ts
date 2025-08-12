import {
  Table,
  Column,
  Model,
  DataType,
  AllowNull,
  Unique,
  Default,
  BeforeCreate,
  BeforeUpdate,
} from 'sequelize-typescript';
import * as bcrypt from 'bcrypt';




@Table({
  tableName: 'users',
  timestamps: false,
})
export class User extends Model<User> {
 @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @AllowNull(false)
  @Unique
  @Column({
    type: DataType.STRING(50),
    validate: {
      notEmpty: true,
    },
  })
  username!: string;

  @AllowNull(false)
  @Column(DataType.STRING(555))
  password_hash!: string;

  // Not stored in DB, used for setting plain password
  private _password?: string;

  set password(password: string) {
    this._password = password;
  }

  get password(): string | undefined {
    return this._password;
  }

  async setPassword(password: string) {
    const salt = await bcrypt.genSalt(10);
    this.password_hash = await bcrypt.hash(password, salt);
  }

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password_hash);
  }
  @BeforeCreate
  @BeforeUpdate
  static async hashPassword(instance: User) {
    if (instance._password) {
      const salt = await bcrypt.genSalt(10);
      instance.password_hash = await bcrypt.hash(instance._password, salt);
      instance._password = undefined;
    }
  }

  @AllowNull(true)
  @Unique
  @Column(DataType.STRING(255))
  phone?: string;

  @AllowNull(true)
  @Unique
  @Column(DataType.STRING(255))
  telegramId?: string;

  @AllowNull(false)
  @Column(DataType.STRING(100))
  first_name!: string;

  @AllowNull(false)
  @Column(DataType.STRING(100))
  last_name!: string;

  @AllowNull(true)
  @Column(DataType.STRING(500))
  avatar_url!: string;

  @Default(true)
  @Column(DataType.BOOLEAN)
  is_active!: boolean;

  @Default(DataType.NOW)
  @Column(DataType.DATE)
  created_at!: Date;

  @AllowNull(true)
  @Column(DataType.DATE)
  last_login?: Date;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: true
  })
  balance: number;

   @Column({
    type: DataType.ENUM('user', 'admin', 'teacher'),
    allowNull: true
  })
  role: 'user' | 'admin' | 'teacher';

}
