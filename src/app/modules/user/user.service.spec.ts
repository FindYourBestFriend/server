import { User } from '@entity/user.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SaveUserDto } from './user.dto';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;
  let repository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
  });

  describe('save', () => {
    it('should save a new user with success', async () => {
      const data: SaveUserDto = {
        email: 'user@email.com',
        name: 'User',
      };
      const userEntityMock = { ...data } as User;
      jest.spyOn(repository, 'create').mockReturnValueOnce(userEntityMock);
      jest.spyOn(repository, 'save').mockResolvedValueOnce(userEntityMock);
      const result = await service.save(data);
      expect(result).toBeDefined();
      expect(repository.create).toBeCalledTimes(1);
      expect(repository.save).toBeCalledTimes(1);
    });
  });
});
