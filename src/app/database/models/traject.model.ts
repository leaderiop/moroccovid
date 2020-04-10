import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { UserModel } from './user.model';

@Entity('traject')
export class TrajectModel {
  @PrimaryGeneratedColumn()
  id: string;
  @Column({ type: 'boolean', default: false })
  uploaded: boolean;
  @CreateDateColumn()
  startedAt: Date;
  @UpdateDateColumn()
  endAt: Date;
  @Column()
  user_id: string;
}
