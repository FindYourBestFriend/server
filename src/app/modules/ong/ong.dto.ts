import { IsString, IsNotEmpty, IsEmail } from 'class-validator';
import { SaveUserDto } from '../user/user.dto';

export class SaveOngDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class UpdateOngDto extends SaveOngDto {}

export class SaveUserOngDto extends SaveUserDto {}
