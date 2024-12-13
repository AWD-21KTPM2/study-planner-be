import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class Status extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({
    type: [String],
    required: true,
    default: ['Todo', 'Doing', 'Ready for Review', 'Done'],
  })
  statuses: string[];
}

export const StatusSchema = SchemaFactory.createForClass(Status);
