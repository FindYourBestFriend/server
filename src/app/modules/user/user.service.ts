import { User } from '@app/entity/user.entity';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { SaveUserDto, UpdateUserDto } from '@modules/user/user.dto';
import { uuid } from '@app/utils/uuid';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
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
    const user = this.findOne({ id });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return user;
  }

  async save(user: SaveUserDto): Promise<User> {
    const newUser = this.userRepository.create(user);

    const userExist = await this.findOne({ email: user.email });

    if (userExist) {
      throw new BadRequestException('Usuário já cadastrado');
    }

    newUser.id = uuid.generate();
    return await this.userRepository.save(newUser);
  }

  async update(id: string, user: UpdateUserDto): Promise<User> {
    const oldUser = await this.findOneOrFail(id);

    this.userRepository.merge(oldUser, user);

    return await this.userRepository.save(oldUser);
  }

  async deleteById(id: string): Promise<void> {
    await this.findOneOrFail(id);
    await this.userRepository.delete({ id });
  }
}
