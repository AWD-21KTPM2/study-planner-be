import { Module } from '@nestjs/common';
import { AiGenerateService } from './ai-generate.service';
import { AiGenerateController } from './ai-generate.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { TaskSchema } from '../task/entites/task.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Task',
        schema: TaskSchema,
      },
    ]),
  ],
  controllers: [AiGenerateController],
  providers: [AiGenerateService],
})
export class AiGenerateModule {}
