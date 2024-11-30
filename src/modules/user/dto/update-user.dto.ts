import { PartialType } from '@nestjs/mapped-types';
import { RegistryUserDto } from './registry-user.dto';

export class UpdateUserDto extends PartialType(RegistryUserDto) {}
