import {Entity,PrimaryGeneratedColumn,Column,OneToMany,JoinColumn} from "typeorm";
import {Product} from "./product.entity";

@Entity()
export class Category {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @OneToMany(type => Product, product => product.category)
    products: Product[];

}
