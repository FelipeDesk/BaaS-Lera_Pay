import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { User } from '../../users/entities/user.entity';

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
  gatewayUserId: string;

  @Column()
  document: string;

  @Column({ type: 'int' })
  codigoCliente: number;

  @Column()
  chaveLoja: string;

  @Column({ type: 'text' })
  accessToken: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}