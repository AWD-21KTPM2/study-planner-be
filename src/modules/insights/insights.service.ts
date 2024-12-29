import { Injectable } from '@nestjs/common';
import { Task } from '../task/entites/task.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { TaskService } from '../task/task.service';
import { TimerService } from '../timer/timer.service';
import { TaskStatus } from 'src/common/enums/task.enum';
import { TimerProgressResponse } from './response/timer-progress.res';
import { ResponseData } from 'src/common/types/common.type';

@Injectable()
export class InsightsService {
  constructor(
    @InjectModel(Task.name) private readonly taskModel: Model<Task>,
    private readonly taskService: TaskService,
    private readonly timerService: TimerService,
  ) {}

  async getTimeProgress(userId: string): Promise<ResponseData<TimerProgressResponse>> {
    const myTasks = await this.taskModel.find({ userId }).lean();

    const tasksWithTimers = await Promise.all(
      myTasks.map(async (task) => {
        const timers = await this.timerService.getTimersByTaskIdForInsight(task._id.toString(), userId);

        const totalActualTime = timers.reduce((acc: number, curr: any) => acc + curr.actualTime, 0);

        const tmp = {
          ...task,
          totalActualTime,
        }; // Spread task and add timers
        return tmp;
      }),
    );

    let totalEstimatedTime = 0;
    let totalActualTime = 0;

    tasksWithTimers.forEach((task) => {
      totalEstimatedTime += task.estimatedTime;
      totalActualTime += task.totalActualTime;
    });

    const totalProductivity = (totalActualTime / 1000 / (totalEstimatedTime * 3600)) * 100;

    const countTodoTasks = tasksWithTimers.filter((task) => task.status === TaskStatus.TODO).length;
    const countInProgressTasks = tasksWithTimers.filter((task) => task.status === TaskStatus.IN_PROGRESS).length;
    const countCompletedTasks = tasksWithTimers.filter((task) => task.status === TaskStatus.COMPLETED).length;
    const countExpiredTasks = tasksWithTimers.filter((task) => task.status === TaskStatus.EXPIRED).length;

    return {
      message: 'Time progress fetched successfully',
      data: {
        totalProductivity: parseFloat(totalProductivity.toFixed(2)),
        countTodoTasks,
        countInProgressTasks,
        countCompletedTasks,
        countExpiredTasks,
        totalTasks: myTasks.length,
      },
    } as ResponseData<TimerProgressResponse>;
  }
}
