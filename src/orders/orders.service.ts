import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Order } from "../entities/order.entity";
import { Product } from "../entities/product.entity";
import { Category } from "../entities/category.entity";
import { OrderItem } from "../interfaces/order-item.interfaces";
import { CreateOrderDto } from "../dto/create-order.dto";
import { WhatsappService } from "../whatsapp/whatsapp.service";
import { of } from "rxjs";
import { WhatsappResponse } from "../interfaces/whatsappResponse";

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    private whatsappService: WhatsappService,
    @InjectRepository(Product)
    private productRepository: Repository<Product>
  ) {}

  async validateProduct(items: OrderItem[]): Promise<any> {
    if (items.length === 0) {
      throw new BadRequestException("Items are required");
    }
    let total = 0;
    for (const item of items) {
      const product = await this.productRepository.findOne({
        where: { id: item.productId },
      });
      if (!product) {
        throw new BadRequestException("Product does not exist");
      }
      if (product.stockIn < item.quantity) {
        throw new BadRequestException("Product is out of stock");
      }
      total += product.price * item.quantity;
      product.stockIn -= item.quantity;
      await this.productRepository.save(product);
    }
    return total;
  }

  async create(createOrderDto: CreateOrderDto): Promise<WhatsappResponse> {
    const total = await this.validateProduct(createOrderDto.items);

    const order = this.ordersRepository.create({
      ...createOrderDto,
      total,
    });

    const savedOrder = await this.ordersRepository.save(order);
    // Generar el link de WhatsApp
    const whatsappLink = this.whatsappService.generateWhatsappLink(savedOrder);

    // Retornar la orden con el link
    return {
      order: savedOrder,
      whatsappLink,
    };
  }

  async findOne(orderId: string): Promise<Order | null> {
    try {
      const order = await this.ordersRepository.findOne({
        where: { id: orderId },
      });
      return order || null; // Retorna la orden o null si no se encuentra
    } catch (e) {
      return null; // En caso de error, retorna null
    }
  }
}
