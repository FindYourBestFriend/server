import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '@app/entity/user.entity';
import { SingUpDto } from './auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { crypto } from '@app/utils/crypto';
import { JwtService } from '@nestjs/jwt';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EmailTemplate } from '@app/modules/email/email.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
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

    this.eventEmitter.emit(
      'email.send',
      user.email,
      EmailTemplate.ConfirmEmail,
    );

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
      this.userRepository.create(body),
    );

    this.eventEmitter.emit(
      'email.send',
      user.email,
      EmailTemplate.ConfirmEmail,
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
      },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
      },
    });

    if (!user) return null;

    const isPasswordValid = crypto.compare(password, user.password);

    if (!isPasswordValid) return null;

    delete user.password;

    return user;
  }
}
