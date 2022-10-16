import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@app/entity/user.entity';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '../../modules/user/user.module';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RefreshJwtStrategy } from './strategies/refresh-jwt.strategy';
import { OngJwtStrategy } from './strategies/ong-jwt.strategy';
import { ONG } from '@app/entity/ongs.entity';
import { UserToken } from '@app/entity/user-token.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([User, ONG, UserToken]),
    UserModule,
    PassportModule,
    JwtModule.register({
      privateKey: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: '1d',
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    RefreshJwtStrategy,
    OngJwtStrategy,
  ],
})
export class AuthModule {}
