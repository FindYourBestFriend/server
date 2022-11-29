import { AnimalType } from '@app/entity/animal.entity';
import { IsString, IsNotEmpty, IsEnum, IsOptional, IsArray } from 'class-validator';

export class SaveAnimalDto {
  @IsString()
  @IsNotEmpty()
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
}

export class UpdateAnimalDto extends SaveAnimalDto {}
