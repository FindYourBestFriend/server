import { IsString, MaxLength } from 'class-validator';
import { Column, Entity, Index, ManyToOne } from 'typeorm';
import { User } from '@entity/user.entity';
import { CustomBaseEntity } from '@entity/base';

export enum UserTokenStatus {
  Expired = 'expired',
  Used = 'used',
  Valid = 'valid',
  Canceled = 'canceled',
}

export enum UserTokenType {
  ResetPassword = 'reset_password',
  EmailConfirmation = 'email_confirmation',
}

@Entity()
export class UserToken extends CustomBaseEntity {
  @Index()
  @Column()
  @IsString()
  @MaxLength(255)
  token: string;

  @Column('enum', {
    default: UserTokenStatus.Valid,
    enum: UserTokenStatus,
  })
  status: UserTokenStatus;

  @Index()
  @Column('enum', {
    enum: UserTokenType,
  })
  type: UserTokenType;

  @ManyToOne(() => User, (user) => user.tokens, {
    onDelete: 'CASCADE',
  })
  user: User;
}
