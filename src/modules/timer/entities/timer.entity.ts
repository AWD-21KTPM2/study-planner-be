import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { BaseEntity } from 'src/core/entity/base/entity.base';

@Schema()
export class Timer extends BaseEntity {
  @Prop({ type: Types.ObjectId, ref: 'Task', required: true }) // Reference to the Task collection
  taskId: Types.ObjectId;

  @Prop({ type: Date })
  sessionStart: Date;

  @Prop({ type: Date })
  sessionEnd: Date;

  @Prop({ required: true })
  flag: boolean; // Marks whether the event is a duration (true) or break (false)

  @Prop({ type: Types.ObjectId, ref: 'User', required: true }) // Reference to the User collection
  userId: Types.ObjectId;
}

const TimerSchema = SchemaFactory.createForClass(Timer).index({
  taskId: 1,
  userId: 1,
});

// Assert the sessionEnd is later than sessionStart
TimerSchema.path('sessionEnd').validate(function (value) {
  return value > this.sessionStart;
});

export { TimerSchema };
