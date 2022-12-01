import { Animal } from '@app/entity/animal.entity';
import { Location } from '@app/entity/location.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PublicService } from './public.service';

describe('PublicService', () => {
  let service: PublicService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PublicService,
        {
          provide: getRepositoryToken(Animal),
          useValue: {},
        },
        {
          provide: getRepositoryToken(Location),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<PublicService>(PublicService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
