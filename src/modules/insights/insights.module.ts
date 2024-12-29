import { Module } from '@nestjs/common';
import { InsightsService } from './insights.service';
import { InsightsController } from './insights.controller';
import { TaskService } from '../task/task.service';
import { Task, TaskSchema } from '../task/entites/task.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from '../user/entities/user.entity';
import { TimerSchema } from '../timer/entities/timer.entity';
import { TimerService } from '../timer/timer.service';
import { AiGenerateService } from '../ai-generate/ai-generate.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Task',
        schema: TaskSchema,
      },
      {
        name: 'User',
        schema: UserSchema,
      },
      {
        name: 'Timer',
        schema: TimerSchema,
      },
    ]),
  ],
  controllers: [InsightsController],
  providers: [InsightsService, TaskService, TimerService, AiGenerateService],
})
export class InsightsModule {}
