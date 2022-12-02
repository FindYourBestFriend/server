import { AnimalType } from '@app/entity/animal.entity';
import { User } from '@app/entity/user.entity';

import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsArray,
} from 'class-validator';

export class SaveAnimalDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsEnum(AnimalType)
  type: AnimalType;

  @IsString()
  @IsOptional()
  typeNote: string;

  @IsString()
  @IsOptional()
  breed: string;

  @IsArray()
  @IsOptional()
  images: string[];

  @IsNotEmpty()
  creator: User;
}

export class UpdateAnimalDto extends SaveAnimalDto {}

