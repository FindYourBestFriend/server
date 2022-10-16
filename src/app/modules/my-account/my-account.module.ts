import { User } from '@app/entity/user.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MyAccountController } from './my-account.controller';
import { MyAccountService } from './my-account.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [MyAccountController],
  providers: [MyAccountService],
})
export class MyAccountModule {}
