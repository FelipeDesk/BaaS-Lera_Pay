import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('webhook_events')
export class WebhookEvent {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 100,
  })
  eventType: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    unique: true,
  })
  externalEventId: string | null;

  @Column({
    type: 'json',
  })
  payload: object;

  @Column({
    type: 'boolean',
    default: false,
  })
  processed: boolean;

  @CreateDateColumn()
  createdAt: Date;
}