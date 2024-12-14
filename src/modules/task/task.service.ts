import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task } from './entites/task.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../user/entities/user.entity';
import { UserNotFoundException } from 'src/common/exceptions/user.exception';
import { TaskNotFoundException } from 'src/common/exceptions/task.exception';

@Injectable()
export class TaskService {
  constructor(
    @InjectModel(Task.name) private readonly taskModel: Model<Task>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async getTaskById(id: string) {
    const task = await this.taskModel.findOne({ _id: id });
    if (!task) {
      throw new TaskNotFoundException();
    }

    return {
      total_items: 1,
      tasks: task,
    };
  }

  async getTasksByUserId(userId: string) {
    const task = await this.taskModel.find({ userId });
    if (!task) {
      throw new TaskNotFoundException();
    }

    return {
      total_items: task.length,
      tasks: task,
    };
  }

  async createTask(taskData: CreateTaskDto): Promise<Task> {
    const { userId } = taskData;

    // Check if user exists
    const existingUser = await this.userModel.findOne({ _id: userId });
    if (!existingUser) {
      throw new UserNotFoundException();
    }

    const newTask = new this.taskModel(taskData);
    await newTask.save();

    return newTask;
  }

  async updateTask(id: string, taskData: CreateTaskDto) {
    const task = await this.taskModel.findOne({ _id: id });
    if (!task) {
      throw new TaskNotFoundException();
    }

    const updatedTask = await this.taskModel.findOneAndUpdate(
      { _id: id },
      { $set: taskData },
      { new: true },
    );

    if (!updatedTask) {
      throw new TaskNotFoundException();
    }

    return updatedTask;
  }

  async deleteTask(id: string) {
    const task = await this.taskModel.findOne({ _id: id });
    if (!task) {
      throw new TaskNotFoundException();
    }

    await this.taskModel.findByIdAndDelete(id);

    return {
      message: 'Task deleted successfully',
    };
  }

  async filterTasks(query: any) {
    throw new Error('Not implemented');
  }
}
