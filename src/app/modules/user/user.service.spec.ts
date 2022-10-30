import { User } from '@entity/user.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './user.dto';
import { UserService } from './user.service';
import { userMock } from '@mocks/user.mock';

const listOfUsers = userMock.listOfUsers;
const user = userMock.user;

describe('UserService', () => {
  let userService: UserService;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            find: jest.fn().mockResolvedValue(listOfUsers),
            findOne: jest.fn().mockResolvedValue(user),
            create: jest.fn().mockReturnValue(user),
            merge: jest.fn().mockReturnValue(user),
            save: jest.fn().mockResolvedValue(user),
            softDelete: jest.fn().mockReturnValue(undefined),
          },
        },
        EventEmitter2,
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
    expect(userRepository).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an user list successfully', async () => {
      const result = await userService.find();

      expect(result).toEqual(listOfUsers);
      expect(userRepository.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('should return an user successfully', async () => {
      const result = await userService.findOne({ id: '1' });

      expect(result).toEqual(user);
      expect(userRepository.findOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOneOrFail', () => {
    it('should return an user successfully', async () => {
      const result = await userService.findOneOrFail('1');

      expect(result).toEqual(user);
      expect(userRepository.findOne).toHaveBeenCalledTimes(1);
    });

    it('should throw a bad request exception to a not found user', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(null);

      try {
        await userService.findOneOrFail('1');
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toBe('Usuário não encontrado');
      }
    });
  });

  describe('create', () => {
    it('should create a new user successfully', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(null);

      const data = user;
      const result = await userService.save(data);

      expect(result).toEqual(user);
      expect(userRepository.create).toHaveBeenCalledTimes(1);
      expect(userRepository.save).toHaveBeenCalledTimes(1);
    });

    it('should throw a bad request exception to an exist user', async () => {
      const data = user;

      try {
        await userService.save(data);
      } catch (e) {
        expect(e).toBeInstanceOf(BadRequestException);
        expect(e.message).toBe('Usuário já cadastrado');
      }
    });
  });

  describe('update', () => {
    it('should update a user successfully', async () => {
      jest.spyOn(userRepository, 'save').mockResolvedValueOnce(user);

      const data: UpdateUserDto = {
        name: 'Gabriel Back',
      };
      const result = await userService.update('1', data);

      expect(result).toBe(user);
      expect(userRepository.findOne).toHaveBeenCalledTimes(1);
      expect(userRepository.save).toHaveBeenCalledTimes(1);
      expect(userRepository.merge).toHaveBeenCalledTimes(1);
    });

    it('should throw a bad request exception a not found user', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(null);

      const data: UpdateUserDto = {
        name: 'Gabriel Back',
      };

      try {
        await userService.update('1', data);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toBe('Usuário não encontrado');
      }
    });
  });

  describe('deleteById', () => {
    it('should delete a user successfully', async () => {
      const result = await userService.deleteById('1');

      expect(result).toBeUndefined();
      expect(userRepository.softDelete).toHaveBeenCalledTimes(1);
      expect(userRepository.findOne).toHaveBeenCalledTimes(1);
    });
  });
});
