import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  NotFoundException,
} from "@nestjs/common";
import { OrdersService } from "./orders.service";
import { CreateOrderDto } from "../dto/create-order.dto";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";

import { Order } from "../entities/order.entity";
import { WhatsappService } from "src/whatsapp/whatsapp.service";
import { WhatsappResponse } from "../interfaces/whatsappResponse";

@ApiTags("orders")
@Controller("orders")
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly whatsappService: WhatsappService
  ) {}
  @ApiOperation({ summary: "Create an order" })
  @ApiResponse({ status: 201, description: "Order Created" })
  @ApiResponse({ status: 400, description: "Bad Request" })
  @Post()
  create(@Body() createOrderDto: CreateOrderDto): Promise<WhatsappResponse> {
    return this.ordersService.create(createOrderDto);
  }

  @Get("checkout/:orderId")
  async checkout(@Param("orderId") orderId: string): Promise<WhatsappResponse> {
    const order = await this.ordersService.findOne(orderId);
    if (!order) {
      throw new NotFoundException("Order not found");
    }
    const whatsappLink = this.whatsappService.generateWhatsappLink(order);
    return { order: { ...order }, whatsappLink };
  }
}
