import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { List } from '../list/list.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({default: 2})
  roleId: number;

  @OneToMany(() => List, list => list.user)
  lists: List[];
}