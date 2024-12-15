import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskDto {
  @ApiProperty({ description: 'Name', example: 'Study Plan' })
  name: string;

  @ApiProperty({
    description: 'Description',
    example: 'Study Plan for the next exam',
  })
  description?: string;

  @ApiProperty({
    description: 'Start Date',
    example: '2021-09-01T00:00:00.000Z',
  })
  startDate?: Date;

  @ApiProperty({ description: 'End Date', example: '2021-09-10T00:00:00.000Z' })
  endDate?: Date;

  @ApiProperty({ description: 'Estimated Time', example: 120 })
  estimatedTime?: number;

  @ApiProperty({ description: 'Task Priority', example: 'MEDIUM' })
  priority?: string;

  @ApiProperty({ description: 'Task Status', example: 'TODO' })
  status?: string;

  @ApiProperty({ description: 'User ID', example: '613f1b3b0c9a7b001f6b1f1a' })
  userId: string;
}
