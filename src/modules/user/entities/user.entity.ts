import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AuthProviderEnum } from 'src/common/enums/auth.enum';
import { BaseEntity } from 'src/core/entity/base/entity.base';

@Schema()
export class User extends BaseEntity {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ default: '' })
  password: string;

  @Prop({ default: '' })
  name: string;

  @Prop({ default: '' })
  avatar: string;

  @Prop({ default: '' })
  phone: string;

  @Prop({ default: '' })
  country: string;

  @Prop({ default: '' })
  bio: string;

  @Prop({ enum: AuthProviderEnum, default: AuthProviderEnum.EMAIL })
  authProvider: AuthProviderEnum;

  @Prop({ default: '' })
  refreshToken: string;

  @Prop()
  passwordResetToken?: string;

  @Prop()
  passwordResetExpires?: Date;

  @Prop({ default: false })
  isActivated: boolean;

  @Prop()
  otp?: string;

  @Prop()
  otpExpiresAt?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
