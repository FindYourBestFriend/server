import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@entity/user.entity';
import { UserService } from './user.service';
import { EmailService } from '../email/email.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserService, EmailService],
  exports: [UserService],
})
export class UserModule {}
