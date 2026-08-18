import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { User } from '../../users/user.entity';

@Entity('gateway_accounts')
export class GatewayAccount {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(
    () => User,
    (user) => user.gatewayAccount,
  )
  @JoinColumn()
  user: User;

  @Column()
  document: string;

  @Column({ nullable: true })
  codigoCliente: string;

  @Column({ nullable: true })
  chaveLoja: string;

  @Column({ type: 'text', nullable: true })
  accessToken: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}