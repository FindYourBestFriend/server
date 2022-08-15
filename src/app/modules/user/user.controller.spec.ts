import { User } from '@app/entity/user.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { SaveUserDto } from './user.dto';
import { UserService } from './user.service';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('save', () => {
    it('should save a new user with success', async () => {
      const body: SaveUserDto = {
        email: 'user@email.com',
        name: 'User',
      };
      const userEntityMock = { ...body } as User;
      jest.spyOn(service, 'save').mockResolvedValueOnce(userEntityMock);
      const result = await controller.save(body);
      expect(result).toBeDefined();
      expect(service.save).toBeCalledTimes(1);
    });
  });
});
