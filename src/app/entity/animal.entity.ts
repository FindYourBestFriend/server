import { IsEnum, IsOptional, IsString } from 'class-validator';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { CustomBaseEntity } from '@app/entity/base';
import { User } from '@app/entity/user.entity';
import { Location } from '@app/entity/location.entity';

export enum AnimalType {
  Cat = 'cat',
  Dog = 'dog',
  Other = 'other',
}

@Entity()
export class Animal extends CustomBaseEntity {
  @Column({ nullable: true })
  @IsString()
  @IsOptional()
  name: string;

  @Column('enum', {
    enum: AnimalType,
  })
  @IsEnum(AnimalType)
  type: AnimalType;

  @Column({ nullable: true })
  @IsString()
  @IsOptional()
  typeNote: string;

  @Column({ nullable: true })
  @IsOptional()
  breed: string;

  @Column({ nullable: true, type: 'json' })
  @IsOptional()
  images: string[];

  @ManyToOne(() => User, user => user.animals)
  creator: User;

  @OneToMany(() => Location, location => location.animal, { cascade: true })
  locations: Location[];
}
