import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PublicController } from '@app/modules/public/public.controller';
import { PublicService } from '@app/modules/public/public.service';
import { Animal } from '@app/entity/animal.entity';
import { Location } from '@app/entity/location.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Animal, Location])],
  controllers: [PublicController],
  providers: [PublicService]
})
export class PublicModule {}
