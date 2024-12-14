import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { TaskPriority, TaskStatus } from 'src/common/enums/task.enum';
import { BaseEntity } from 'src/core/entity/base/entity.base';

@Schema()
export class Task extends BaseEntity {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;

  @Prop({ required: true })
  estimatedTime: number; // in minutes

  @Prop({ required: false })
  actualTime: number; // in minutes

  @Prop({ enum: TaskPriority, default: TaskPriority.MEDIUM })
  priority: TaskPriority;

  @Prop({ enum: TaskStatus, default: TaskStatus.TODO })
  status: TaskStatus;

  // @Prop({ type: String, required: true })
  // status: string; // Status name (e.g., "Todo", "Doing")

  @Prop({ type: Types.ObjectId, ref: 'User', required: true }) // Reference to the User collection
  userId: Types.ObjectId;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
