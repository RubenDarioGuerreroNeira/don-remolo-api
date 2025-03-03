import { OrdersService } from "./orders.service";
import { CreateOrderDto } from "../dto/create-order.dto";
import { WhatsappService } from "src/whatsapp/whatsapp.service";
import { WhatsappResponse } from "../interfaces/whatsappResponse";
export declare class OrdersController {
    private readonly ordersService;
    private readonly whatsappService;
    constructor(ordersService: OrdersService, whatsappService: WhatsappService);
    create(createOrderDto: CreateOrderDto): Promise<WhatsappResponse>;
    checkout(orderId: string): Promise<WhatsappResponse>;
}
