import { Animal } from '@app/entity/animal.entity';
import { LocationType } from '@app/entity/location.entity';
import { User } from '@app/entity/user.entity';
import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsArray,
} from 'class-validator';

export class SaveLocationDto {
  @IsString()
  @IsNotEmpty()
  latitude: string;

  @IsString()
  @IsNotEmpty()
  longitude: string;

  @IsEnum(LocationType)
  type: LocationType;

  @IsString()
  @IsOptional()
  typeNote: string;

  @IsNotEmpty()
  animal: Animal;

  @IsArray()
  @IsOptional()
  images: string[];

  @IsNotEmpty()
  creator: User;
}

export class UpdateLocationDto extends SaveLocationDto {}
