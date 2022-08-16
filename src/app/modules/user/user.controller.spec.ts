import { User } from '@app/entity/user.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { SaveUserDto, UpdateUserDto } from './user.dto';
import { UserService } from './user.service';

const userList: User[] = [
  new User({ email: 'gabriel.back@gmail.com', name: 'Gabriel Back' }),
  new User({ email: 'gabriel.oliveira@gmail.com', name: 'Gabriel Oliveira' }),
  new User({ email: 'gabriel.bini@gmail.com', name: 'Gabriel Bini' }),
  new User({ email: 'gabriel.machado@gmail.com', name: 'Gabriel Machado' }),
];

const newUser = new User({
  email: 'gabriel.back@gmail.com',
  name: 'Gabriel Back',
});

const updatedUser = new User({
  ...userList[0],
  email: 'gabrielback@gmail.com',
});

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            find: jest.fn().mockResolvedValue(userList),
            findOne: jest.fn().mockResolvedValue(userList[0]),
            findOneOrFail: jest.fn().mockResolvedValue(userList[0]),
            save: jest.fn().mockResolvedValue(newUser),
            update: jest.fn().mockResolvedValue(updatedUser),
            deleteById: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
    expect(userService).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an user list successfully', async () => {
      const result = await userController.findAll();

      expect(result).toBe(userList);
      expect(userService.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('should return an user successfully', async () => {
      const result = await userController.findOne('1');

      expect(result).toBe(userList[0]);
      expect(userService.findOneOrFail).toHaveBeenCalledTimes(1);
    });
  });

  describe('save', () => {
    it('should save a new user successfully', async () => {
      const body: SaveUserDto = {
        email: 'gabriel.back@gmail.com',
        name: 'Gabriel Back',
      };
      const result = await userController.save(body);
      expect(result).toBe(newUser);
      expect(userService.save).toBeCalledTimes(1);
      expect(userService.save).toBeCalledWith(body);
    });
  });

  describe('update', () => {
    it('should update a user successfully', async () => {
      const body: UpdateUserDto = {
        email: 'gabrielback@gmail.com',
        name: 'Gabriel Back',
      };
      const result = await userController.update('1', body);
      expect(result).toBe(updatedUser);
      expect(userService.update).toBeCalledTimes(1);
      expect(userService.update).toBeCalledWith('1', body);
    });
  });

  describe('delete', () => {
    it('should delete an user successfully', async () => {
      const result = await userController.delete('1');

      expect(result).toBeUndefined();
      expect(userService.deleteById).toHaveBeenCalledTimes(1);
      expect(userService.deleteById).toBeCalledWith('1');
    });
  });
});
