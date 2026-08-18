import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { User } from '../../users/user.entity';

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  user: User;

  @Column({
    type: 'varchar',
    length: 255,
    unique: true,
  })
  gatewayTransactionId: string;

  @Column({
    type: 'varchar',
    length: 255,
  })
  externalReference: string;

  @Column({
    type: 'int',
  })
  amount: number;

  @Column({
    type: 'enum',
    enum: ['PIX', 'CREDIT_CARD', 'WITHDRAWAL'],
  })
  type: 'PIX' | 'CREDIT_CARD' | 'WITHDRAWAL';

  @Column({
    type: 'enum',
    enum: [
      'PENDING',
      'APPROVED',
      'DENIED',
      'EXPIRED',
      'CANCELLED',
    ],
  })
  status:
    | 'PENDING'
    | 'APPROVED'
    | 'DENIED'
    | 'EXPIRED'
    | 'CANCELLED';

  @CreateDateColumn()
  createdAt: Date;
}