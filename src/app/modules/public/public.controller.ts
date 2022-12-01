import { Controller, Get, Param } from '@nestjs/common';
import { PublicService } from '@app/modules/public/public.service';

@Controller('v1/public')
export class PublicController {
  constructor(
    private readonly publicService: PublicService,
  ) {}

  @Get('animals')
  async findAnimals() {
    return this.publicService.findAnimals();
  }

  @Get('animals/:id')
  async findOneAnimal(@Param('id') id: string) {
    return this.publicService.findOneAnimal(id);
  }

  @Get('locations')
  async findLocations() {
    return this.publicService.findLocations();
  }
}
