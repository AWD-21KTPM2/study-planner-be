import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Timer } from 'src/modules/timer/entities/timer.entity';
import { Task } from 'src/modules/task/entites/task.entity';
import { Model, Types } from 'mongoose';
import { User } from '../user/entities/user.entity';
import { TaskNotFoundException } from 'src/common/exceptions/task.exception';
import { TimerNotFoundException } from 'src/common/exceptions/timer.exceptions';

@Injectable()
export class TimerService {
  constructor(
    @InjectModel(Timer.name) private readonly timerModel: Model<Timer>,
    @InjectModel(Task.name) private readonly taskModel: Model<Task>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}
  async startTimer(body: any, userId: string): Promise<any> {
    const { taskId, flag } = body;

    // check if user, task exists
    const task = await this.taskModel.findOne({ _id: taskId, userId });

    if (!task) {
      throw new TaskNotFoundException();
    }

    const newTimer = new this.timerModel({
      taskId,
      sessionStart: new Date(),
      flag,
      userId,
    });

    await newTimer.save();

    return newTimer;
  }

  async stopTimer(body: any, userId: string): Promise<any> {
    const { taskId, flag } = body;
    // check if user, task exists
    const task = await this.taskModel.findOne({ _id: taskId, userId });

    if (!task) {
      throw new TaskNotFoundException();
    }

    // find the timer last started by the user
    const timer = await this.timerModel.findOne({
      taskId,
      userId,
      flag,
      sessionEnd: null,
    });

    if (!timer) {
      throw new TimerNotFoundException();
    }

    timer.sessionEnd = new Date();
    await timer.save();

    return timer;
  }

  async getTimersByTaskIdForInsight(
    taskId: string,
    userId: string,
  ): Promise<any> {
    const timerList = await this.timerModel.aggregate([
      {
        $match: {
          taskId,
          userId,
        },
      },
      {
        $project: {
          actualTime: {
            $cond: [
              {
                $and: [
                  { $ifNull: ['$sessionStart', false] },
                  { $ifNull: ['$sessionEnd', false] },
                ],
              },
              { $subtract: ['$sessionEnd', '$sessionStart'] },
              null,
            ],
          },
        },
      },
    ]);
    return timerList;
  }
}
