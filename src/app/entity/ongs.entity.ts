import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';
import { IsNotEmpty, IsString } from 'class-validator';
import { CustomBaseEntity } from '@entity/base';
import { User } from '@entity/user.entity';

@Entity()
export class ONG extends CustomBaseEntity {
  @Column({ nullable: false })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ManyToMany(() => User)
  @JoinTable()
  users: User[];

  constructor(ong?: Partial<ONG>) {
    super();
    this.name = ong?.name;
    this.users = ong?.users || [];
  }
}
