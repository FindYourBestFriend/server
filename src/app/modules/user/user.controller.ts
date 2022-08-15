import { Body, Controller, Post } from '@nestjs/common';
import { SaveUserDto } from '@modules/user/user.dto';
import { UserService } from '@modules/user/user.service';
import { User } from '@app/entity/user.entity';

@Controller('api/v1/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async save(@Body() body: SaveUserDto): Promise<User> {
    return this.userService.save(body);
  }
}
