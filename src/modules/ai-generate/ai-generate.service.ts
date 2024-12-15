import { Injectable } from '@nestjs/common';
import { Task } from '../task/entites/task.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';
import { ConfigService } from '@nestjs/config';
import { ENV_CONST } from 'src/common/constants/env.const';
import {
  AI_GENERATE_CONST,
  AI_TASK_PLACEHOLDER,
} from 'src/common/constants/ai-generate.const';
import { ErrorAnalyzeTaskException } from 'src/common/exceptions/ai-generate.exception';

@Injectable()
export class AiGenerateService {
  private generativeAi: GoogleGenerativeAI;
  private aiModel: GenerativeModel;

  constructor(
    @InjectModel(Task.name) private taskModel: Model<Task>,
    private configService: ConfigService,
  ) {
    this.generativeAi = new GoogleGenerativeAI(
      this.configService.get(ENV_CONST.GEMINI_KEY),
    );
    this.aiModel = this.generativeAi.getGenerativeModel({
      model: 'gemini-1.5-flash',
    });
  }

  async analyzeTaskWithAi(): Promise<string> {
    const filterTasks = await this.taskModel.find(
      { startDate: { $ne: null }, endDate: { $ne: null } }, // Filter condition
      'startDate endDate priority', // Projection
    );

    if (filterTasks.length === 0) {
      return 'No tasks to analyze';
    }

    const promptString = AI_GENERATE_CONST.TASK_TEMPLATE.replace(
      AI_TASK_PLACEHOLDER,
      JSON.stringify(filterTasks),
    );

    // console.log(promptString);

    try {
      const result = await this.aiModel.generateContent(promptString);
      console.log(result.response.text());
      return result.response.text();
    } catch (error) {
      throw new ErrorAnalyzeTaskException();
    }
  }
}
