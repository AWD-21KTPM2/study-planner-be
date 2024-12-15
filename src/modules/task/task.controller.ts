import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task } from './entites/task.entity';
import { ResponseData } from 'src/common/types/common.type';
import { JWT_OBJECT } from 'src/common/constants/jwt.const';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { JwtObjectGuard } from 'src/modules/auth/jwt-object.guard';
import { JwtPayload } from 'src/common/types/jwt.type';

interface TaskResponse {
  total_items: number;
  tasks: Task[];
}

@ApiTags('tasks')
@Controller('task')
@UseGuards(JwtObjectGuard)
@ApiBearerAuth()
export class TaskController {
  constructor(
    private readonly taskService: TaskService,
    private readonly jwtService: JwtService,
  ) {}

  @Get()
  @ApiOkResponse({
    description: 'Task found',
    schema: {
      example: {
        message: 'Task found successfully',
        data: {
          name: 'Task 1',
          description: 'Task 1 description',
          startDate: '2021-09-01T00:00:00.000Z',
          endDate: '2021-09-10T00:00:00.000Z',
          estimatedTime: 60,
          priority: 'MEDIUM',
          status: 'TODO',
          userId: '613f1b3b0c9a7b001f6b1f1a',
        },
      },
    },
  })
  async getTaskByUser(
    @Req() req: Request,
  ): Promise<ResponseData<TaskResponse>> {
    const { id } = req[JWT_OBJECT] as JwtPayload;
    const tasks = await this.taskService.getTasksByUserId(id);
    return {
      message: 'Tasks found successfully',
      data: tasks,
    };
  }

  @Get(':id')
  @ApiOkResponse({
    description: 'Task found',
    type: Task,
  })
  async getTask(@Param('id') id: string): Promise<ResponseData<TaskResponse>> {
    const task = await this.taskService.getTaskById(id);
    return {
      message: 'Task found successfully',
      data: task,
    };
  }

  // Post /tasks/
  @Post()
  @ApiOkResponse({
    description: 'Task created',
    schema: {
      example: {
        message: 'Task created successfully',
        data: {
          name: 'Task 1',
          description: 'Task 1 description',
          startDate: '2021-09-01T00:00:00.000Z',
          endDate: '2021-09-10T00:00:00.000Z',
          estimatedTime: 60,
          priority: 'MEDIUM',
          status: 'TODO',
          createdAt: '2021-09-15T00:00:00.000Z',
          updatedAt: '2021-09-15T00:00:00.000Z',
          __v: 0,
        },
      },
    },
  })
  async createTask(
    @Body() taskData: CreateTaskDto,
    @Req() req: Request,
  ): Promise<ResponseData<Task>> {
    const { id } = req[JWT_OBJECT] as JwtPayload;
    const createdTask = await this.taskService.createTask({
      ...taskData,
      userId: id,
    });
    return {
      message: 'Task created successfully',
      data: createdTask,
    };
  }

  // Put /tasks/:id
  @Put(':id')
  async updateTask(
    @Param('id') id: string,
    @Body() taskData: CreateTaskDto,
    @Req() req: Request,
  ) {
    const { id: userId } = req[JWT_OBJECT] as JwtPayload;
    const updateTask = await this.taskService.updateTask(id, {
      ...taskData,
      userId,
    });
    return {
      message: 'Task updated successfully',
      data: updateTask,
    } as ResponseData<Task>;
  }
  // Delete /tasks/:id
  @Delete(':id')
  async deleteTask(@Param('id') id: string, @Req() req: Request) {
    const { id: userId } = req[JWT_OBJECT] as JwtPayload;
    return this.taskService.deleteTask(id, userId);
  }

  // Get /tasks/filter?status=todo&priority=high&userId=613f1b3b0c9a7b001f6b1f1a&startDate=2021-09-01&endDate=2021-09-10
  @Get('filter')
  async filterTasks(@Query() query: any) {
    // to be implemented
    throw new Error('Not implemented');
  }
}
