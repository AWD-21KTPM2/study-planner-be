import { Prop } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export class BaseEntity extends Document {
  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}
