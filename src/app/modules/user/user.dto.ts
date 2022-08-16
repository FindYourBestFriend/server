export class SaveUserDto {
  name: string;
  email: string;
}

export class UpdateUserDto extends SaveUserDto {}
