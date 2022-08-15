import { Entity, Column } from 'typeorm';
import { CustomBaseEntity } from './base';

@Entity()
export class User extends CustomBaseEntity {
  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  email: string;
}
