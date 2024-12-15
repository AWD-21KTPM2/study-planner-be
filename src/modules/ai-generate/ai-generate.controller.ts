import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AiGenerateService } from './ai-generate.service';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { JwtObjectGuard } from '../auth/jwt-object.guard';

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
  getProfileByEmail(@Req() req: Request) {
    return this.aiGenerateService.analyzeTaskWithAi();
  }
}
