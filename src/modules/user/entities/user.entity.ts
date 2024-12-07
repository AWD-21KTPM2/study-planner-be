import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AuthProviderEnum } from 'src/common/enums/auth.enum';
import { BaseEntity } from 'src/core/entity/base/entity.base';

@Schema()
export class User extends BaseEntity {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  // @Prop({ required: true })
  // name: string;

  @Prop({ default: '' })
  avatar: string;

  @Prop({ enum: AuthProviderEnum, default: AuthProviderEnum.EMAIL })
  authProvider: AuthProviderEnum;

  @Prop({ default: '' })
  refreshToken: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
