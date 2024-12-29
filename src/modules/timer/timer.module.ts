import { Module } from '@nestjs/common';
import { TimerService } from './timer.service';
import { TimerController } from './timer.controller';
import { UserService } from '../user/user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { TaskSchema } from '../task/entites/task.entity';
import { UserSchema } from '../user/entities/user.entity';
import { TimerSchema } from './entities/timer.entity';
import { JwtModule } from '@nestjs/jwt';

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
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '24h' },
    }),
  ],
  controllers: [TimerController],
  providers: [TimerService],
})
export class TimerModule {}
