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
} from '@nestjs/common';
import { SaveOngDto, UpdateOngDto } from '@app/modules/ong/ong.dto';
import { OngService } from '@app/modules/ong/ong.service';

@Controller('api/v1/ong')
export class OngController {
  constructor(private readonly ongService: OngService) {}
  @Get()
  async findAll() {
    return await this.ongService.find();
  }

  @Get(':id')
  async findOne(@Param('id', ValidationUUIDPipe) id: string) {
    return await this.ongService.findOneOrFail(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async save(@Body() body: SaveOngDto): Promise<ONG> {
    return await this.ongService.save(body);
  }

  @Post(':orgId/add-user/:userId')
  @HttpCode(HttpStatus.CREATED)
  async addUser(
    @Param('orgId', ValidationUUIDPipe) orgId: string,
    @Param('userId', ValidationUUIDPipe) userId: string,
  ) {
    return await this.ongService.addUser(orgId, userId);
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
