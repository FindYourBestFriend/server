import { Animal } from '@app/entity/animal.entity';
import { Location } from '@app/entity/location.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class PublicService {
  constructor(
    @InjectRepository(Animal)
    private readonly animalRepository: Repository<Animal>,
    @InjectRepository(Location)
    private readonly locationRepository: Repository<Location>,
  ) {}
  
  async findAnimals() {
    return await this.animalRepository.find();
  }

  async findOneAnimal(id: string) {
    return await this.animalRepository.findOne({
      where: {
        id,
      },
      relations: ['locations'],
    });
  }

  async findLocations() {
    return await this.locationRepository.find();
  }
}
