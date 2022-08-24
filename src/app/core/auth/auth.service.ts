import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '@app/entity/user.entity';
import { SingUpDto } from './auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { crypto } from '@app/utils/crypto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async login(user: User) {
    const payload = { sub: user.id, email: user.email };
    const token = this.jwtService.sign(payload);

    return { token, user };
  }

  async singUp(body: SingUpDto): Promise<{ token: string; user: User }> {
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
    const payload = { sub: user.id, email: user.email };
    const token = this.jwtService.sign(payload);

    delete user.password;

    return { token, user: user };
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
