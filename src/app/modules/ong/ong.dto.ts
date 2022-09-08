import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class SaveOngDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class UpdateOngDto extends SaveOngDto {}

export class SaveUserOngDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
