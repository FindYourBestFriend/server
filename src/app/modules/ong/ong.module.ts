import { Module } from '@nestjs/common';
import { OngService } from './ong.service';
import { OngController } from './ong.controller';
import { ONG } from '@app/entity/ongs.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@app/entity/user.entity';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([ONG, User]), UserModule],
  providers: [OngService],
  controllers: [OngController],
})
export class OngModule {}
