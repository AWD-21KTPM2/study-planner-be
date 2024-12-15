import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AiGenerateService } from './ai-generate.service';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { JwtObjectGuard } from '../auth/jwt-object.guard';
import { AnalyzeTaskResponse } from './response/analyze-task.response';

@ApiTags('ai-generate')
@Controller('ai-generate')
export class AiGenerateController {
  constructor(private readonly aiGenerateService: AiGenerateService) {}

  @ApiBearerAuth()
  @UseGuards(JwtObjectGuard)
  @Get('tasks/analyze')
  @ApiOkResponse({
    description: 'Analyzing tasks with AI',
  })
  getProfileByEmail(
    @Req() req: Request,
  ): Promise<AnalyzeTaskResponse | string> {
    return this.aiGenerateService.analyzeTaskWithAi();
  }
}
