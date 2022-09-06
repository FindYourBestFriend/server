import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { SaveUserDto, UpdateUserDto } from '@modules/user/user.dto';
import { UserService } from '@modules/user/user.service';
import { User } from '@app/entity/user.entity';
import { ValidationUUIDPipe } from '@app/core/pipe/uuid-validation.pipe';
import { AuthGuard } from '@nestjs/passport';

@Controller('api/v1/user')
@UseGuards(AuthGuard('jwt'))
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll(): Promise<User[]> {
    return await this.userService.find();
  }

  @Get(':id')
  async findOne(@Param('id', ValidationUUIDPipe) id: string): Promise<User> {
    return await this.userService.findOneOrFail(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async save(@Body() body: SaveUserDto): Promise<User> {
    return await this.userService.save(body);
  }

  @Put(':id')
  async update(
    @Param('id', ValidationUUIDPipe) id: string,
    @Body() body: UpdateUserDto,
  ): Promise<User> {
    return await this.userService.update(id, body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ValidationUUIDPipe) id: string): Promise<void> {
    await this.userService.deleteById(id);
  }
}
