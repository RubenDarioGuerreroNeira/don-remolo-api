import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  JoinColumn,
} from "typeorm";
import { Product } from "./product.entity";
import { UUID } from "typeorm/driver/mongodb/bson.typings";

@Entity("categories")
export class Category {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @OneToMany((type) => Product, (product) => product.category)
  products: Product[];
}
