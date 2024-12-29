import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { TimerService } from './timer.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtObjectGuard } from 'src/modules/auth/jwt-object.guard';
import { JWT_OBJECT } from 'src/common/constants/jwt.const';
import { JwtPayload } from 'src/common/types/jwt.type';

@ApiTags('timers')
@Controller('timer')
@UseGuards(JwtObjectGuard)
@ApiBearerAuth()
export class TimerController {
  constructor(private readonly timerService: TimerService) {}

  @Post('/start')
  async startTimer(@Body() body: any, @Req() req: Request): Promise<any> {
    const { id: userId } = req[JWT_OBJECT] as JwtPayload;
    return this.timerService.startTimer(body, userId);
  }

  @Post('/stop')
  async stopTimer(@Body() body: any, @Req() req: Request): Promise<any> {
    const { id: userId } = req[JWT_OBJECT] as JwtPayload;
    return this.timerService.stopTimer(body, userId);
  }
}
