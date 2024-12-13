import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { StatusService } from './status.service';
import { CreateStatusDto } from './dto/create-status.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { ApiTags, ApiOkResponse } from '@nestjs/swagger';

@ApiTags('statuses')
@Controller('status')
export class StatusController {
  constructor(private readonly statusService: StatusService) {}

  @Get()
  @ApiOkResponse({ description: 'Get all statuses for a user' })
  async getAllStatuses(@Query('userId') userId: string) {
    if (!userId) {
      throw new NotFoundException('User ID is required');
    }
    return this.statusService.findAll(userId);
  }

  @Post()
  @ApiOkResponse({ description: 'Create statuses for a user' })
  async createStatus(@Body() createStatusDto: CreateStatusDto) {
    return this.statusService.create(createStatusDto);
  }

  @Put()
  @ApiOkResponse({ description: 'Update statuses for a user' })
  async updateStatus(
    @Query('userId') userId: string,
    @Body() updateStatusDto: UpdateStatusDto,
  ) {
    if (!userId) {
      throw new NotFoundException('User ID is required');
    }
    return this.statusService.update(userId, updateStatusDto);
  }

  @Delete()
  @ApiOkResponse({ description: 'Delete statuses for a user' })
  async deleteStatus(@Query('userId') userId: string) {
    if (!userId) {
      throw new NotFoundException('User ID is required');
    }
    return this.statusService.delete(userId);
  }
}
