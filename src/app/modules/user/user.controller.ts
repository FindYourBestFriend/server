import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
} from '@nestjs/common';
import { SaveUserDto, UpdateUserDto } from '@modules/user/user.dto';
import { UserService } from '@modules/user/user.service';
import { User } from '@app/entity/user.entity';

@Controller('api/v1/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll(): Promise<User[]> {
    return await this.userService.find();
  }

  @Get(':id')
  async findOne(@Param('id', new ParseUUIDPipe()) id: string): Promise<User> {
    return await this.userService.findOneOrFail(id);
  }

  @Post()
  async save(@Body() body: SaveUserDto): Promise<User> {
    return await this.userService.save(body);
  }

  @Put(':id')
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() body: UpdateUserDto,
  ): Promise<User> {
    return await this.userService.update(id, body);
  }

  @Delete(':id')
  async delete(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    return await this.userService.deleteById(id);
  }
}
