import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { BaseEntity } from 'src/core/entity/base/entity.base';

@Schema()
export class Timer extends BaseEntity {
  @Prop({ type: Types.ObjectId, ref: 'Task', required: true }) // Reference to the Task collection
  taskId: Types.ObjectId;

  @Prop({ required: true })
  sessionStart: Date;

  @Prop({ required: true })
  sessionEnd: Date;

  @Prop({ required: true })
  duration: number; // in minutes

  @Prop({ required: true })
  breakDuration: number; // in minutes

  @Prop({ required: true })
  flag: boolean; // Marks whether the event is a duration (true) or break (false)

  @Prop({ type: Types.ObjectId, ref: 'User', required: true }) // Reference to the User collection
  userId: Types.ObjectId;
}

export const TimerSchema = SchemaFactory.createForClass(Timer);
