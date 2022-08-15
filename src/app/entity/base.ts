import {
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
} from 'typeorm';

export abstract class CustomBaseEntity extends BaseEntity {
  @PrimaryColumn('uuid')
  id: string;

  @CreateDateColumn({ type: 'timestamp', nullable: false })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updatedAt: Date;
}
