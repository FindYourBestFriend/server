import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SaveAnimalDto, UpdateAnimalDto } from '@app/modules/animal/animal.dto';
import { Animal } from '@app/entity/animal.entity';

@Injectable()
export class AnimalService {
  constructor(
    @InjectRepository(Animal)
    private readonly animalRepository: Repository<Animal>,
  ) {}

  findAll(creatorId: string): Promise<Animal[]> {
    return this.animalRepository.find({
      where: {
        creator: {
          id: creatorId,
        },
      },
    });
  }

  findOne(id: string, creatorId: string): Promise<Animal> {
    return this.animalRepository.findOne({
      where: {
        id,
        creator: {
          id: creatorId,
        },
      },
      relations: ['locations'],
    });
  }

  async save(body: SaveAnimalDto): Promise<Animal> {
    const newAnimal = this.animalRepository.create(body);

    const savedAnimal = await this.animalRepository.save(newAnimal);
    return await this.animalRepository.findOne({
      where: {
        id: savedAnimal.id,
      },
    });
  }

  async update(id: string, body: UpdateAnimalDto): Promise<Animal> {
    await this.animalRepository.update(id, body);
    return await this.animalRepository.findOne({
      where: {
        id,
      },
    });
  }

  async deleteById(id: string): Promise<void> {
    await this.animalRepository.softDelete({ id });
  }
}

