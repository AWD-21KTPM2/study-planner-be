import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { InsightsService } from './insights.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JWT_OBJECT } from 'src/common/constants/jwt.const';
import { JwtPayload } from 'src/common/types/jwt.type';
import { JwtObjectGuard } from '../auth/jwt-object.guard';
import { TimerProgressResponse } from './response/timer-progress.res';
import { ResponseData } from 'src/common/types/common.type';

@ApiTags('insights')
@Controller('insights')
export class InsightsController {
  constructor(private readonly insightsService: InsightsService) {}

  @Get('time-progress')
  @ApiBearerAuth()
  @UseGuards(JwtObjectGuard)
  async getTimeProgress(@Req() req: Request): Promise<ResponseData<TimerProgressResponse>> {
    const { id } = req[JWT_OBJECT] as JwtPayload;
    return this.insightsService.getTimeProgress(id);
  }
}
