import { ONG } from '@app/entity/ongs.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserService } from '../user/user.service';
import { OngService } from './ong.service';
import { userMock } from '@mocks/user.mock';
import { ongMock } from '@mocks/ong.mock';

const ongList = ongMock.listOfOngs;

const user = userMock.user;

const updatedOng = ongMock.ong;

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
