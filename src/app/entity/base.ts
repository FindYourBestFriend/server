import {
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  BeforeInsert,
  DeleteDateColumn,
} from 'typeorm';
import { IsOptional, IsUUID } from 'class-validator';
import { uuid } from '@app/utils/uuid';

export abstract class CustomBaseEntity extends BaseEntity {
  @PrimaryColumn('uuid')
  @IsUUID('4')
  @IsOptional()
  id: string;

  @CreateDateColumn({ type: 'timestamp', nullable: false })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedAt: Date;

  @BeforeInsert()
  generateId(): void {
    if (!this.id) {
      this.id = uuid.generate();
    }
  }
}
