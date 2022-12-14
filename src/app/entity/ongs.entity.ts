import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';
import { IsNotEmpty, IsString } from 'class-validator';
import { CustomBaseEntity } from '@app/entity/base';
import { User } from '@app/entity/user.entity';

@Entity()
export class ONG extends CustomBaseEntity {
  @Column({ nullable: false })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ManyToMany(() => User, (user) => user.ongs)
  @JoinTable()
  users: User[];
}
