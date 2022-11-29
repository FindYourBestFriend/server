import { ValidationUUIDPipe } from '@app/core/pipe/uuid-validation.pipe';
import { Animal } from '@app/entity/animal.entity';
import { Controller, Get, HttpStatus, Param } from '@nestjs/common';
import { Body, Delete, HttpCode, Post, Put, Req, UseGuards } from '@nestjs/common/decorators';
import { SaveAnimalDto, UpdateAnimalDto } from '@app/modules/animal/animal.dto';
import { AnimalService } from '@app/modules/animal/animal.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('animal')
@UseGuards(AuthGuard('jwt'))
export class AnimalController {
  constructor(
    private readonly animalService: AnimalService,
  ) {}
  
  @Get()
  async findAll(@Req() req) {
    const currentUserId = req.user.id;
    return await this.animalService.findAll(currentUserId);
  }

  @Get(':id')
  async findById(@Req() req, @Param('id', ValidationUUIDPipe) id: string) {
    const currentUserId = req.user.id;
    return await this.animalService.findOne(id, currentUserId);
  }

  @Post(':id')
  @HttpCode(HttpStatus.CREATED)
  async save(@Body() body: SaveAnimalDto): Promise<Animal> {
    return await this.animalService.save(body);
  }

  @Put(':id')
  async update(
    @Param('id', ValidationUUIDPipe) id: string,
    @Body() body: UpdateAnimalDto,
  ): Promise<Animal> {
    return await this.animalService.update(id, body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ValidationUUIDPipe) id: string): Promise<void> {
    await this.animalService.deleteById(id);
  }
}
