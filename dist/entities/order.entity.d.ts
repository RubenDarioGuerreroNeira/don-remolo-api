import { OrderItem } from "../interfaces/order-item.interfaces";
export declare class Order {
    id: string;
    items: OrderItem[];
    total: number;
    customerName: string;
    customerPhone: string;
    customerAddress: string;
    createdAt: Date;
}
