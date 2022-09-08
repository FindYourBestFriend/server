import { User } from '@app/entity/user.entity';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { SaveUserDto, UpdateUserDto } from '@modules/user/user.dto';
import { EmailTemplate } from '../email/email.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly eventEmmiter: EventEmitter2,
  ) {}

  async find(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findOne(where: FindOptionsWhere<User>): Promise<User> {
    return await this.userRepository.findOne({
      where,
    });
  }

  async findOneOrFail(id: string): Promise<User> {
    const user = await this.findOne({ id });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return user;
  }

  async save(user: User): Promise<User> {
    const userExist = await this.findOne({ email: user.email });

    if (userExist) {
      throw new BadRequestException('Usuário já cadastrado');
    }

    await this.userRepository.save(this.userRepository.create(user));

    this.eventEmmiter.emit('email.send', user.email, EmailTemplate.Invite, {
      user_name: user.name,
      ong_name: 'Patudos da Rua',
      link: 'http://test.com',
    });

    return await this.userRepository.findOne({
      where: {
        id: user.id,
      },
    });
  }

  async update(id: string, user: UpdateUserDto): Promise<User> {
    const oldUser = await this.findOneOrFail(id);

    this.userRepository.merge(oldUser, user);

    return await this.userRepository.save(oldUser);
  }

  async deleteById(id: string): Promise<void> {
    await this.findOneOrFail(id);
    await this.userRepository.softDelete({ id });
  }
}
