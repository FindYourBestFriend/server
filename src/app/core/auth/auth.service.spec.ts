import { UserToken } from '@app/entity/user-token.entity';
import { User } from '@app/entity/user.entity';
import { BadRequestException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: {},
        },
        {
          provide: getRepositoryToken(UserToken),
          useValue: {},
        },
        JwtService,
        EventEmitter2,
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('password validation', () => {
    it('should validate a valid password', () => {
      const result = authService.passwordValidation('Abcd1234');

      expect(result).toBeUndefined();
    });

    it('should throw a bad request exception to an lower password', () => {
      try {
        authService.passwordValidation('123');
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe('A senha deve ter no mínimo 8 caracteres');
      }
    });

    it('should throw a bad request exception to a not include letters', () => {
      try {
        authService.passwordValidation('1293810238');
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe(
          'A senha deve ter pelo menos uma letra maiúscula e uma minúscula',
        );
      }
    });

    it('should throw a bad request exception to a not include numbers', () => {
      try {
        authService.passwordValidation('abcdefghIj');
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe('A senha deve ter pelo menos um número');
      }
    });
  });
});
