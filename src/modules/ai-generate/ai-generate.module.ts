import { Module } from '@nestjs/common';
import { AiGenerateService } from './ai-generate.service';
import { AiGenerateController } from './ai-generate.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { TaskSchema } from '../task/entites/task.entity';
import { TimerService } from '../timer/timer.service';
import { TimerSchema } from '../timer/entities/timer.entity';
import { UserSchema } from '../user/entities/user.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'User',
        schema: UserSchema,
      },
      {
        name: 'Task',
        schema: TaskSchema,
      },
      {
        name: 'Timer',
        schema: TimerSchema,
      },
    ]),
  ],
  controllers: [AiGenerateController],
  providers: [AiGenerateService, TimerService],
})
export class AiGenerateModule {}
