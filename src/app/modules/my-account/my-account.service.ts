import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '@app/entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { IUpdateUser } from './my-account.controller';

@Injectable()
export class MyAccountService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async currentUser(userId: string) {
    return await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });
  }

  async update(id: string, user: IUpdateUser) {
    await this.userRepository.update(id, user);

    return await this.userRepository.findOne({ where: { id } });
  }
}
