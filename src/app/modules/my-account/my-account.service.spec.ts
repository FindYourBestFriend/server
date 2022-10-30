import { User } from '@app/entity/user.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MyAccountService } from './my-account.service';

const user = new User({ name: 'Gabriel', email: 'gabriel@findyourbestfriend.social' });

describe('MyAccountService', () => {
  let service: MyAccountService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MyAccountService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn().mockResolvedValue(user),
            update: jest.fn().mockResolvedValue(user),
          },
        },
      ],
    }).compile();

    service = module.get<MyAccountService>(MyAccountService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
