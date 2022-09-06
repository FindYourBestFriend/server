import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEmail,
  IsUUID,
} from 'class-validator';

export class SaveOngDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class UpdateOngDto extends SaveOngDto {}
