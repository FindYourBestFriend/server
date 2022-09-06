import { ONG } from '@app/entity/ongs.entity';
import { User } from '@app/entity/user.entity';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { UserService } from '@app/modules/user/user.service';
import { SaveOngDto, UpdateOngDto } from './ong.dto';

@Injectable()
export class OngService {
  constructor(
    @InjectRepository(ONG)
    private readonly ongRepository: Repository<ONG>,
    private readonly userService: UserService,
  ) {}

  async find(): Promise<ONG[]> {
    return await this.ongRepository.find();
  }

  async findOne(where: FindOptionsWhere<ONG>): Promise<ONG> {
    return await this.ongRepository.findOne({
      where,
    });
  }

  async findOneOrFail(id: string): Promise<ONG> {
    const ong = await this.findOne({ id });

    if (!ong) {
      throw new NotFoundException('ONG não encontrada');
    }

    return ong;
  }

  async addUser(ongId: string, userId: string): Promise<void> {
    const user = await this.userService.findOneOrFail(userId);
    const ong = await this.ongRepository.findOne({
      where: {
        id: ongId,
      },
      relations: ['users'],
      select: {
        id: true,
        users: {
          id: true,
        },
      },
    });

    if (!ong) {
      throw new NotFoundException('ONG não encontrada');
    }

    ong.users.push(user);

    await this.ongRepository.save(ong);
  }

  async removeUser(ongId: string, userId: string) {
    const user = await this.userService.findOneOrFail(userId);
    const ong = await this.ongRepository.findOne({
      where: {
        id: ongId,
        users: {
          id: userId,
        },
      },
      relations: ['users'],
      select: {
        id: true,
        users: {
          id: true,
        },
      },
    });

    if (!ong) {
      throw new NotFoundException('ONG com este usuário não encontrada');
    }

    ong.users = ong.users.filter((ongUser) => ongUser.id !== user.id);

    await this.ongRepository.save(ong);
  }

  async save(ong: SaveOngDto): Promise<ONG> {
    const ongExist = await this.findOne({ name: ong.name });

    if (ongExist) {
      throw new BadRequestException('ONG já cadastrada');
    }

    const newOng = this.ongRepository.create(ong);

    const savedOng = await this.ongRepository.save(newOng);
    return await this.ongRepository.findOne({
      where: {
        id: savedOng.id,
      },
    });
  }

  async update(id: string, ong: UpdateOngDto): Promise<ONG> {
    const oldOng = await this.findOneOrFail(id);

    this.ongRepository.merge(oldOng, ong);

    return await this.ongRepository.save(oldOng);
  }

  async deleteById(id: string): Promise<void> {
    await this.findOneOrFail(id);
    await this.ongRepository.softDelete({ id });
  }
}
