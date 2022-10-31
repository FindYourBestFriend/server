import { ValidationUUIDPipe } from '@app/core/pipe/uuid-validation.pipe';
import { ONG } from '@app/entity/ongs.entity';
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
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  SaveOngDto,
  SaveUserOngDto,
  UpdateOngDto,
} from '@app/modules/ong/ong.dto';
import { OngService } from '@app/modules/ong/ong.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';

@UseGuards(AuthGuard('ong-jwt'))
@Controller('v1/ong')
@ApiTags('ONG')
export class OngController {
  constructor(private readonly ongService: OngService) {}
  @Get()
  async findAll(@Req() req) {
    const userId = req.headers.user.id;
    return await this.ongService.findAllOfCurrentUser(userId);
  }

  @Get('/users')
  async findUsers() {
    return await this.ongService.findUsers();
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async save(@Body() body: SaveOngDto): Promise<ONG> {
    return await this.ongService.save(body);
  }

  @Post('/add-user')
  @HttpCode(HttpStatus.CREATED)
  async addUser(@Body() body: SaveUserOngDto) {
    return await this.ongService.addUser(body);
  }

  @Post(':orgId/remove-user/:userId')
  @HttpCode(HttpStatus.CREATED)
  async removeUser(
    @Param('orgId', ValidationUUIDPipe) orgId: string,
    @Param('userId', ValidationUUIDPipe) userId: string,
  ) {
    return await this.ongService.removeUser(orgId, userId);
  }

  @Put(':id')
  async update(
    @Param('id', ValidationUUIDPipe) id: string,
    @Body() body: UpdateOngDto,
  ): Promise<ONG> {
    return await this.ongService.update(id, body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ValidationUUIDPipe) id: string): Promise<void> {
    await this.ongService.deleteById(id);
  }
}
