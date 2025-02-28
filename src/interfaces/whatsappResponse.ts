import { Order } from "../entities/order.entity";

export interface WhatsappResponse {
  order: Order;
  whatsappLink: string;
}
