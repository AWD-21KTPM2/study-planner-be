import { Types } from 'mongoose';
import { TaskPriority, TaskStatus } from '../enums/task.enum';

type Task = {
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  estimatedTime: number;
  actualTime: number;
  priority: TaskPriority;
  status: TaskStatus;
  userId: Types.ObjectId;
};
