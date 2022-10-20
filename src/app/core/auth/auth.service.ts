import { Repository } from 'typeorm';

import { JwtService } from '@nestjs/jwt';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { BadRequestException, Injectable } from '@nestjs/common';

import { kryptos } from '@app/utils/crypto';
import { EmailTemplate } from '@app/modules/email/email.service';
import { User, UserStatus } from '@app/entity/user.entity';
import { UserToken, UserTokenStatus, UserTokenType } from '@app/entity/user-token.entity';

import { SingUpDto } from './auth.dto';


import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserToken)
    private readonly userTokenRepository: Repository<UserToken>,
    private readonly jwtService: JwtService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async login(user: User) {
    const token_payload = { sub: user.id, email: user.email };
    const refresh_token_payload = { sub: user.id };
    const token = this.jwtService.sign(token_payload);
    const refresh_token = this.jwtService.sign(refresh_token_payload, {
      privateKey: process.env.REFRESH_JWT_SECRET,
      expiresIn: '7d',
    });

    return { refresh_token, token, user };
  }

  async singUp(body: SingUpDto) {
    const haveUser = await this.userRepository.findOne({
      where: {
        email: body.email,
      },
    });

    if (haveUser) {
      throw new BadRequestException('E-mail já cadastrado');
    }

    const user = await this.userRepository.save(
      this.userRepository.create({ ...body, status: UserStatus.Created }),
    );

    const token = crypto.randomBytes(10).toString('hex');

    const userToken = new UserToken();
    userToken.token = token;
    userToken.user = user;
    userToken.type = UserTokenType.EmailConfirmation;

    await this.userTokenRepository.save(
      this.userTokenRepository.create(userToken)
    );

    this.eventEmitter.emit(
      'email.send',
      user.email,
      EmailTemplate.ConfirmEmail,
      {
        token,
        user_name: user.name,
        user_email: user.email,
        confirmation_link: ''
      },
    );

    delete user.password;

    return { user };
  }

  async refreshToken(userId: string) {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new BadRequestException('Usuário não encontrado');
    }

    const payload = { sub: user.id, email: user.email };
    const token = this.jwtService.sign(payload);

    return { token };
  }

  async confirmEmail(token: string) {
    const userToken = await this.userTokenRepository.findOne({
      where: {
        token,
        type: UserTokenType.EmailConfirmation,
      },
      relations: ['user'],
    });

    if (!userToken) {
      throw new BadRequestException('Token inválido');
    }

    const createdAt = new Date(userToken.createdAt);
    createdAt.setDate(createdAt.getDate() + 1);

    if (createdAt.getTime() < Date.now()) {
      userToken.status = UserTokenStatus.Expired;
      await this.userTokenRepository.save(userToken);
      throw new BadRequestException('Token expirado');
    }

    userToken.user.status = UserStatus.Confirmed;

    await this.userRepository.save(userToken.user);
    await this.userTokenRepository.delete(userToken.id);

    return userToken.user;
  }

  passwordValidation(password: string): void {
    const moreThanEight = password.length >= 8;

    if (!moreThanEight) {
      throw new BadRequestException('A senha deve ter no mínimo 8 caracteres');
    }

    const lettersRegex = /[a-z]/ && /[A-Z]/;
    const lowerAndUpperLetters = lettersRegex.test(password);

    if (!lowerAndUpperLetters) {
      throw new BadRequestException(
        'A senha deve ter pelo menos uma letra maiúscula e uma minúscula',
      );
    }

    const haveNumber = /\d/.test(password);

    if (!haveNumber) {
      throw new BadRequestException('A senha deve ter pelo menos um número');
    }
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: {
        email,
        status: UserStatus.Confirmed,
      },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
      },
    });

    if (!user) return null;

    const isPasswordValid = kryptos.compare(password, user.password);

    if (!isPasswordValid) return null;

    delete user.password;

    return user;
  }
}
