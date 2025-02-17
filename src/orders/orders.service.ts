import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Order } from "../entities/order.entity";
import { CreateOrderDto } from "../dto/create-order.dto";
import { WhatsappService } from "../whatsapp/whatsapp.service";

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    private whatsappService: WhatsappService
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const total = createOrderDto.items.reduce(
      (sum, item) => sum + item.subtotal,
      0
    );

    const order = this.ordersRepository.create({
      ...createOrderDto,
      total,
    });

    const savedOrder = await this.ordersRepository.save(order);
    await this.whatsappService.sendOrderNotification(savedOrder);

    return savedOrder;
  }
}
