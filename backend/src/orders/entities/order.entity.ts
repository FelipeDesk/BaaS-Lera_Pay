import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { CheckoutLink } from '../../checkout/entities/checkout-link.entity';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => CheckoutLink)
  @JoinColumn()
  checkout: CheckoutLink;

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
  gatewayTransactionId: string | null;

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