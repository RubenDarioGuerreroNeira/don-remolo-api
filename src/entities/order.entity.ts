import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
} from "typeorm";
import { Product } from "./product.entity";
import { OrderItem } from "../interfaces/order-item.interfaces";

@Entity("orders")
export class Order {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("jsonb")
  items: OrderItem[];

  @Column("decimal", { precision: 10, scale: 2 })
  total: number;

  @Column()
  customerName: string;

  @Column()
  customerPhone: string;

  @Column()
  customerAddress: string;

  @CreateDateColumn()
  createdAt: Date;
}
