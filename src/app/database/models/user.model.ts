import { Entity, Column, PrimaryColumn, OneToMany } from 'typeorm';
import { TrajectModel } from './traject.model';

@Entity('user')
export class UserModel {
  @PrimaryColumn('uuid')
  _id: string;
  @Column()
  username: string;
  @Column()
  email: string;
  @Column()
  phone: string;
  @Column()
  firstName: string;
  @Column()
  lastName: string;
  @Column()
  jwt: string;
}
