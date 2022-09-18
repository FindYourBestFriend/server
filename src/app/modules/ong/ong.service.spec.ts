import { ONG } from '@app/entity/ongs.entity';
import { User } from '@app/entity/user.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserService } from '../user/user.service';
import { OngService } from './ong.service';

const ongList: ONG[] = [
  new ONG({ name: 'ONG 01' }),
  new ONG({ name: 'ONG 02' }),
  new ONG({ name: 'ONG 03' }),
];

const user = new User({ name: 'Gabriel', email: 'gabriel@gmail.com' });

const updatedOng = new ONG({
  name: 'ONG 001',
});

describe('OngService', () => {
  let service: OngService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OngService,
        {
          provide: getRepositoryToken(ONG),
          useValue: {
            find: jest.fn().mockResolvedValue(ongList),
            findOne: jest.fn().mockResolvedValue(ongList[0]),
            create: jest.fn().mockReturnValue(ongList[0]),
            merge: jest.fn().mockReturnValue(updatedOng),
            save: jest.fn().mockResolvedValue(ongList[0]),
            delete: jest.fn().mockReturnValue(undefined),
          },
        },
        {
          provide: UserService,
          useValue: {
            findOne: jest.fn().mockResolvedValue(user),
            findOneOrFail: jest.fn().mockResolvedValue(user),
            save: jest.fn().mockResolvedValue(user),
          },
        },
      ],
    }).compile();

    service = module.get<OngService>(OngService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
