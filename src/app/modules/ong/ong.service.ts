import { ONG } from '@app/entity/ongs.entity';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  Inject,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { UserService } from '@app/modules/user/user.service';
import { SaveOngDto, UpdateOngDto } from '@app/modules/ong/ong.dto';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { User } from '@app/entity/user.entity';

@Injectable()
export class OngService {
  constructor(
    @InjectRepository(ONG)
    private readonly ongRepository: Repository<ONG>,
    private readonly userService: UserService,
    @Inject(REQUEST)
    private readonly request: Request,
  ) {}

  async find(): Promise<ONG[]> {
    return await this.ongRepository.find();
  }

  async findAllOfCurrentUser(userId: string): Promise<ONG[]> {
    return await this.ongRepository.find({
      where: {
        users: {
          id: userId,
        },
      },
    });
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

  async addUser(user: User): Promise<void> {
    const ongId = this.request.headers['org-id'] as string;
    const haveUser = await this.userService.findOne({ email: user.email });

    if (!haveUser) {
      user = await this.userService.save(user);
    } else {
      user = haveUser;
    }

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

  async findUsers() {
    const ongId = this.request.headers['ong-id'] as string;
    const ong = await this.ongRepository.findOne({
      where: {
        id: ongId,
      },
      relations: ['users'],
    });

    return ong.users;
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
