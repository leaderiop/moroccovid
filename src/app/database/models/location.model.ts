import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('location')
export class LocationModel {
  @PrimaryGeneratedColumn()
  id: string;
  @Column()
  trajectId: string;
  @Column()
  latitude: number;
  @Column()
  longitude: number;
  @Column()
  accuracy: number;
  @Column()
  speed: number;
  @Column()
  heading: number;
  @Column()
  altitude: number;
  @CreateDateColumn()
  date: Date;
}
