import { ApiProperty } from '@nestjs/swagger';
import {
  IsMongoId,
  IsArray,
  IsOptional,
  ArrayMinSize,
  IsString,
} from 'class-validator';

export class CreateStatusDto {
  @ApiProperty({ description: 'User ID', example: '613f1b3b0c9a7b001f6b1f1a' })
  @IsMongoId()
  userId: string;

  @ApiProperty({
    description: 'Array of status names',
    example: ['Todo', 'Doing', 'Ready for Review', 'Done'],
  })
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  @IsOptional()
  statuses?: string[];
}
