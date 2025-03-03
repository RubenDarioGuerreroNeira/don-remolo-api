import { OrderItem } from "../interfaces/order-item.interfaces";
export declare class CreateOrderDto {
    items: OrderItem[];
    total: number;
    customerName: string;
    customerPhone: string;
    customerAddress: string;
}
