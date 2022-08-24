import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Entity, Column, BeforeInsert } from 'typeorm';
import { CustomBaseEntity } from './base';
import { crypto } from '@app/utils/crypto';

@Entity()
export class User extends CustomBaseEntity {
  @Column({ nullable: false })
  @IsNotEmpty()
  @IsString()
  name: string;

  @Column({ nullable: false })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Column({ select: false, nullable: true })
  password: string;

  @BeforeInsert()
  hashPassword(): void {
    if (this.password) {
      this.password = crypto.encript(this.password);
    }
  }

  constructor(user?: Partial<User>) {
    super();
    this.name = user?.name;
    this.email = user?.email;
  }
}
