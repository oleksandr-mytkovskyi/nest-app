import {Entity,  Column, PrimaryGeneratedColumn} from "typeorm";

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
    
    @Column({default: "2"})
    userId: number;
}
