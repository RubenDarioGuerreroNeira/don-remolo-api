import { Repository } from "typeorm";
import { Order } from "../entities/order.entity";
import { Product } from "../entities/product.entity";
import { OrderItem } from "../interfaces/order-item.interfaces";
import { CreateOrderDto } from "../dto/create-order.dto";
import { WhatsappService } from "../whatsapp/whatsapp.service";
import { WhatsappResponse } from "../interfaces/whatsappResponse";
export declare class OrdersService {
    private ordersRepository;
    private whatsappService;
    private productRepository;
    constructor(ordersRepository: Repository<Order>, whatsappService: WhatsappService, productRepository: Repository<Product>);
    validateProduct(items: OrderItem[]): Promise<any>;
    create(createOrderDto: CreateOrderDto): Promise<WhatsappResponse>;
    findOne(orderId: string): Promise<Order | null>;
}
