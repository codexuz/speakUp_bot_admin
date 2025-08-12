import {
  Table,
  Column,
  Model,
  DataType,
  AllowNull,
  Default,
} from "sequelize-typescript";

@Table({
  tableName: "otp",
  timestamps: false,
})
export class Otp extends Model<Otp> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING(50),
    validate: {
      notEmpty: true,
    },
  })
  telegram_id!: string;

  @AllowNull(false)
  @Column(DataType.TEXT)
  otp_code!: string;

  @AllowNull(false)
  @Column(DataType.BOOLEAN)
  isExpired!: boolean;

  @AllowNull(false)
  @Column(DataType.DATE)
  expiration_date!: Date;

  @Default(DataType.NOW)
  @Column(DataType.DATE)
  created_at!: Date;
}
