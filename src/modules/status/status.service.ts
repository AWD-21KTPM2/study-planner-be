import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Status } from './entities/status.entity';
import { CreateStatusDto } from './dto/create-status.dto';
import { UpdateStatusDto } from './dto/update-status.dto';

@Injectable()
export class StatusService {
  constructor(
    @InjectModel(Status.name) private readonly statusModel: Model<Status>,
  ) {}

  async findAll(userId: string): Promise<Status> {
    const statuses = await this.statusModel.findOne({ userId }).exec();
    if (!statuses) {
      throw new NotFoundException('Statuses not found for this user');
    }
    return statuses;
  }

  async create(createStatusDto: CreateStatusDto): Promise<Status> {
    const { userId, statuses } = createStatusDto;

    // Find the existing Status document for the user
    const existingStatus = await this.statusModel.findOne({ userId }).exec();

    if (!existingStatus) {
      // If no Status document exists, create a new one
      const newStatus = new this.statusModel({
        userId,
        statuses: statuses || ['Todo', 'Doing', 'Ready for Review', 'Done'], // Use default statuses if none provided
      });
      return newStatus.save();
    } else {
      // If the Status document exists, append the new status(es) to the array
      const newStatuses = statuses?.filter(
        (status) => !existingStatus.statuses.includes(status), // Prevent duplicate statuses
      );

      if (!newStatuses || newStatuses.length === 0) {
        throw new Error('All provided statuses already exist');
      }

      // Append the new statuses and save the document
      existingStatus.statuses.push(...newStatuses);
      return existingStatus.save();
    }
  }

  async update(
    userId: string,
    updateStatusDto: UpdateStatusDto,
  ): Promise<Status> {
    const statuses = await this.statusModel
      .findOneAndUpdate({ userId }, { $set: updateStatusDto }, { new: true })
      .exec();

    if (!statuses) {
      throw new NotFoundException('Statuses not found for this user');
    }

    return statuses;
  }

  async delete(userId: string): Promise<void> {
    const result = await this.statusModel.findOneAndDelete({ userId }).exec();
    if (!result) {
      throw new NotFoundException('Statuses not found for this user');
    }
  }
}
