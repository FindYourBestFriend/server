import { Body, Controller, Delete, HttpCode, HttpStatus, Param, Post, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SaveLocationDto, UpdateLocationDto } from './location.dto';
import { Location } from '@app/entity/location.entity';
import { LocationService } from './location.service';
import { ValidationUUIDPipe } from '@app/core/pipe/uuid-validation.pipe';

@Controller('v1/location')
@UseGuards(AuthGuard('jwt'))
export class LocationController {
  constructor(
    private readonly locationService: LocationService,
  ) {}

  @Post(':id')
  @HttpCode(HttpStatus.CREATED)
  async save(@Body() body: SaveLocationDto): Promise<Location> {
    return await this.locationService.save(body);
  }

  @Put(':id')
  async update(
    @Param('id', ValidationUUIDPipe) id: string,
    @Body() body: UpdateLocationDto,
  ): Promise<Location> {
    return await this.locationService.update(id, body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ValidationUUIDPipe) id: string): Promise<void> {
    await this.locationService.deleteById(id);
  }
}
