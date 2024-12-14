import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task } from './entites/task.entity';
import { ResponseData } from 'src/common/types/common.type';
import { TaskQueryException } from 'src/common/exceptions/task.exception';

@ApiTags('tasks')
@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  // Get /tasks?id=613f1b3b0c9a7b001f6b1f1a&userId=613f1b3b0c9a7b001f6b1f1a
  @Get()
  @ApiOkResponse({
    description: 'Task found',
    schema: {
      example: {
        total_items: 1,
        tasks: [
          {
            name: 'Task 1',
            description: 'Task 1 description',
            startDate: '2021-09-01T00:00:00.000Z',
            endDate: '2021-09-10T00:00:00.000Z',
            estimatedTime: 60,
            priority: 'MEDIUM',
            status: 'TODO',
            userId: '613f1b3b0c9a7b001f6b1f1a',
            createdAt: '2021-09-15T00:00:00.000Z',
            updatedAt: '2021-09-15T00:00:00.000Z',
            __v: 0,
          },
        ],
      },
    },
  })
  async getTask(@Query('id') id: string, @Query('userId') userId: string) {
    if (id && userId) {
      throw new TaskQueryException();
    }

    if (id) {
      return this.taskService.getTaskById(id);
    }

    if (userId) {
      return this.taskService.getTasksByUserId(userId);
    }

    throw new TaskQueryException();
  }

  // Post /tasks/
  @ApiBearerAuth()
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
          userId: '613f1b3b0c9a7b001f6b1f1a',
          createdAt: '2021-09-15T00:00:00.000Z',
          updatedAt: '2021-09-15T00:00:00.000Z',
          __v: 0,
        },
      },
    },
  })
  async createTask(@Body() taskData: CreateTaskDto) {
    const createdTask = await this.taskService.createTask(taskData);
    return {
      message: 'Task created successfully',
      data: createdTask,
    } as ResponseData<Task>;
  }

  // Put /tasks/:id
  @Put(':id')
  async updateTask(@Param('id') id: string, @Body() taskData: CreateTaskDto) {
    const updateTask = await this.taskService.updateTask(id, taskData);
    return {
      message: 'Task updated successfully',
      data: updateTask,
    } as ResponseData<Task>;
  }
  // Delete /tasks/:id
  @Delete(':id')
  async deleteTask(@Param('id') id: string) {
    return this.taskService.deleteTask(id);
  }

  // Get /tasks/filter?status=todo&priority=high&userId=613f1b3b0c9a7b001f6b1f1a&startDate=2021-09-01&endDate=2021-09-10
  @Get('filter')
  async filterTasks(@Query() query: any) {
    // to be implemented
    throw new Error('Not implemented');
  }
}
