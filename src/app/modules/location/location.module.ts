import { Module } from '@nestjs/common';
import { LocationController } from '@app/modules/location/location.controller';
import { LocationService } from '@app/modules/location/location.service';
import { Location } from '@app/entity/location.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Location])],
  controllers: [LocationController],
  providers: [LocationService]
})
export class LocationModule {}
