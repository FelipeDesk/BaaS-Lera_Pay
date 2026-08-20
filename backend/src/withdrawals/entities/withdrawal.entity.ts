import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { User } from '../../users/user.entity';

@Entity('withdrawals')
export class Withdrawal {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  user: User;

  @Column({
    type: 'varchar',
    length: 255,
    unique: true,
  })
  externalReference: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  gatewayWithdrawalId: string | null;

  @Column({
    type: 'int',
  })
  amount: number;

  @Column({
    type: 'varchar',
    length: 255,
  })
  pixKey: string;

  @Column({
    type: 'varchar',
    length: 20,
  })
  document: string;

  @Column({
    type: 'varchar',
    length: 255,
  })
  description: string;

  @Column({
    type: 'enum',
    enum: [
      'PENDING',
      'APPROVED',
      'DENIED',
      'EXPIRED',
      'CANCELLED',
    ],
    default: 'PENDING',
  })
  status:
    | 'PENDING'
    | 'APPROVED'
    | 'DENIED'
    | 'EXPIRED'
    | 'CANCELLED';

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}