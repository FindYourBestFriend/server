import { IsEnum, IsOptional, IsString } from 'class-validator';
import { Column, Entity, ManyToOne } from 'typeorm';
import { CustomBaseEntity } from '@app/entity/base';
import { User } from '@app/entity/user.entity';
import { Animal } from '@app/entity/animal.entity';

export enum LocationType {
  Spot = 'spot',
}

@Entity()
export class Location extends CustomBaseEntity {

  @Column('enum', {
    enum: LocationType,
  })
  @IsEnum(LocationType)
  type: LocationType;

  @Column({ nullable: true })
  @IsString()
  @IsOptional()
  latitude: string;

  @Column({ nullable: true })
  @IsString()
  @IsOptional()
  longitude: string;

  @Column({ nullable: true, type: 'json' })
  @IsOptional()
  images: string[];

  @ManyToOne(() => User, user => user.locations)
  creator: User;
  
  @ManyToOne(() => Animal, animal => animal.locations)
  animal: Animal;
  
}
