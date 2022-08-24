import { User } from '@app/entity/user.entity';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { SaveUserDto, UpdateUserDto } from '@modules/user/user.dto';

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
    const user = await this.findOne({ id });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return user;
  }

  async save(user: SaveUserDto): Promise<User> {
    const userExist = await this.findOne({ email: user.email });

    if (userExist) {
      throw new BadRequestException('Usuário já cadastrado');
    }

    const newUser = this.userRepository.create(user);

    const savedUser = await this.userRepository.save(newUser);
    return await this.userRepository.findOne({
      where: {
        id: savedUser.id,
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
    await this.userRepository.delete({ id });
  }
}
