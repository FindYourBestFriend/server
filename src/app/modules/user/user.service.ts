import { User } from '@app/entity/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SaveUserDto } from '@modules/user/user.dto';
import { uuid } from '@app/utils/uuid';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async save(user: SaveUserDto): Promise<User> {
    const newUser = this.userRepository.create(user);
    newUser.id = uuid.generate();
    return await this.userRepository.save(newUser);
  }
}
