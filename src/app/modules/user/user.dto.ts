import { IsString, IsEmail, IsOptional, IsNotEmpty } from 'class-validator';

export class SaveUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;
}

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  name: string;
}
