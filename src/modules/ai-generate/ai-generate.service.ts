import { Injectable } from '@nestjs/common';
import { Task } from '../task/entites/task.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';
import { ConfigService } from '@nestjs/config';
import { ENV_CONST } from 'src/common/constants/env.const';
import { AI_FEEDBACK_CONST, AI_GENERATE_CONST, AI_TASK_PLACEHOLDER } from 'src/common/constants/ai-generate.const';
import { ErrorAnalyzeTaskException, ErrorGenerateFeedbackException } from 'src/common/exceptions/ai-generate.exception';
import { clearJsonFromAI } from 'src/common/utils/json.util';
import { AnalyzeTaskResponse } from './response/analyze-task.res';
import { TaskStatus } from 'src/common/enums/task.enum';
import { TimerService } from '../timer/timer.service';
import { GenerateFeedbackResponse } from './response/generate-feedback.res';
import { PartialType } from '@nestjs/mapped-types';

@Injectable()
export class AiGenerateService {
  private generativeAi: GoogleGenerativeAI;
  private aiModel: GenerativeModel;

  constructor(
    @InjectModel(Task.name) private taskModel: Model<Task>,
    private readonly timerService: TimerService,
    private readonly configService: ConfigService,
  ) {
    this.generativeAi = new GoogleGenerativeAI(this.configService.get(ENV_CONST.GEMINI_KEY));
    this.aiModel = this.generativeAi.getGenerativeModel({
      model: AI_GENERATE_CONST.GEMINI_MODEL,
    });
  }

  async analyzeTaskWithAi(userId: string): Promise<AnalyzeTaskResponse | string> {
    const filterTasks = await this.taskModel.find(
      {
        userId,
        startDate: { $ne: null },
        endDate: { $ne: null },
        status: { $in: [TaskStatus.TODO, TaskStatus.IN_PROGRESS] },
      }, // Filter condition
      'startDate endDate priority', // Projection
    );

    if (filterTasks.length === 0) {
      return 'No tasks to analyze';
    }

    const promptString = AI_GENERATE_CONST.TASK_TEMPLATE.replace(AI_TASK_PLACEHOLDER, JSON.stringify(filterTasks));

    try {
      const result = await this.aiModel.generateContent(promptString);
      const clearJson = clearJsonFromAI(result.response.text());
      const jsonResult = JSON.parse(clearJson) as AnalyzeTaskResponse;
      return jsonResult;
    } catch (error) {
      throw new ErrorAnalyzeTaskException();
    }
  }

  async generateFeedbackWithAi(userId: string): Promise<any> {
    const myTasks = await this.taskModel.find({ userId }).lean();

    const tasksWithTimers = await Promise.all(
      myTasks.map(async (task) => {
        const timers = await this.timerService.getTimersByTaskIdForInsight(task._id.toString(), userId);

        const totalActualTime = timers.reduce((acc: number, curr: any) => acc + curr.actualTime, 0);

        const tmp = {
          name: task.name,
          estimatedTime: task.estimatedTime,
          priority: task.priority,
          status: task.status,
          startDate: task.startDate,
          endDate: task.endDate,
          totalActualTime: parseFloat((totalActualTime / 1000 / 60).toFixed(2)),
        };

        return tmp;
      }),
    );

    if (tasksWithTimers.length === 0) {
      return 'No tasks to generate feedback';
    }

    const promptString = AI_FEEDBACK_CONST.FEEDBACK_TEMPLATE.replace(
      AI_TASK_PLACEHOLDER,
      JSON.stringify(tasksWithTimers),
    );

    try {
      const result = await this.aiModel.generateContent(promptString);
      console.log(result.response.text());
      return result.response.text();
    } catch (error) {
      console.log(error.message);
      throw new ErrorGenerateFeedbackException();
    }
  }
}
