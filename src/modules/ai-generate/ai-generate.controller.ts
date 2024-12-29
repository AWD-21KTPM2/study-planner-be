import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AiGenerateService } from './ai-generate.service';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { JwtObjectGuard } from '../auth/jwt-object.guard';
import { AnalyzeTaskResponse } from './response/analyze-task.res';
import { JwtPayload } from 'src/common/types/jwt.type';
import { JWT_OBJECT } from 'src/common/constants/jwt.const';

@ApiTags('ai-generate')
@Controller('ai-generate')
export class AiGenerateController {
  constructor(private readonly aiGenerateService: AiGenerateService) {}

  @ApiBearerAuth()
  @UseGuards(JwtObjectGuard)
  @Get('tasks/analyze')
  @ApiOkResponse({
    description: 'Analyzing tasks with AI (schedule, overlapped tasks, etc.)',
  })
  getProfileByEmail(@Req() req: Request): Promise<AnalyzeTaskResponse | string> {
    const { id } = req[JWT_OBJECT] as JwtPayload;
    return this.aiGenerateService.analyzeTaskWithAi(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtObjectGuard)
  @Get('feedback/generate')
  @ApiOkResponse({
    description: "Generate feedback for user's tasks to improve and motivate",
  })
  generateFeedbackWithAi(@Req() req: Request): Promise<any> {
    const { id } = req[JWT_OBJECT] as JwtPayload;
    return this.aiGenerateService.generateFeedbackWithAi(id);
  }
}
