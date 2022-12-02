import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Location } from '@app/entity/location.entity';
import { Repository } from 'typeorm';
import {
  SaveLocationDto,
  UpdateLocationDto,
} from '@app/modules/location/location.dto';

@Injectable()
export class LocationService {
  constructor(
    @InjectRepository(Location)
    private readonly locationRepository: Repository<Location>,
  ) {}

  findAll(creatorId: string): Promise<Location[]> {
    return this.locationRepository.find({
      where: {
        creator: {
          id: creatorId,
        },
      },
      relations: ['animal'],
    });
  }

  findOne(id: string, creatorId: string): Promise<Location> {
    return this.locationRepository.findOne({
      where: {
        id,
        creator: {
          id: creatorId,
        },
      },
      relations: ['animal'],
    });
  }

  async save(body: SaveLocationDto): Promise<Location> {
    const newLocation = this.locationRepository.create(body);

    const savedLocation = await this.locationRepository.save(newLocation);
    return await this.locationRepository.findOne({
      where: {
        id: savedLocation.id,
      },
    });
  }

  async update(id: string, body: UpdateLocationDto): Promise<Location> {
    await this.locationRepository.update(id, body);
    return await this.locationRepository.findOne({
      where: {
        id,
      },
    });
  }

  async deleteById(id: string): Promise<void> {
    await this.locationRepository.softDelete({ id });
  }
}

