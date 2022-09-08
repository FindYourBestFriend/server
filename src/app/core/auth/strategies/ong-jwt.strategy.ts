import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { Repository } from 'typeorm';
import { ONG } from '@app/entity/ongs.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@app/entity/user.entity';

@Injectable()
export class OngJwtStrategy extends PassportStrategy(Strategy, 'ong-jwt') {
  constructor(
    @InjectRepository(ONG)
    private readonly ongRepository: Repository<ONG>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload) {
    const ongId = req.headers['ong-id'];

    if (!ongId || typeof ongId === 'object') {
      throw new UnauthorizedException();
    }

    const userId = payload.sub;

    const ong = await this.ongRepository.findOne({
      select: { id: true },
      where: {
        id: ongId,
        users: {
          id: userId,
        },
      },
    });

    if (!ong) throw new UnauthorizedException();

    return { id: userId, ongId: ong.id };
  }
}
