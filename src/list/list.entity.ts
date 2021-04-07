import {Entity,  Column, PrimaryGeneratedColumn, ManyToOne} from "typeorm";
import { User } from '../auth/user.entity';

@Entity()
export class List {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    title: string;
  
    @Column()
    description: string;

    @Column({default: false})
    status: boolean;  
    
    @ManyToOne(type => User, user => user.lists)
    user: number;
}
