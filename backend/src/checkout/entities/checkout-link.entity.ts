import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { User } from '../../users/entities/user.entity';

@Entity('checkout_links')
export class CheckoutLink {
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

  @Column({ type: 'int' })
  amount: number;

  @Column({
    type: 'varchar',
    length: 255,
  })
  description: string;

  @Column({
    type: 'enum',
    enum: ['PIX', 'CREDIT_CARD'],
  })
  paymentMethod: 'PIX' | 'CREDIT_CARD';

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

  @Column({
    type: 'decimal',
    precision: 5,
    scale: 2,
    nullable: true,
  })
  feePercent: number | null;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  gatewayTransactionId: string | null;

  @Column({
    type: 'datetime',
    nullable: true,
  })
  expiresAt: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}