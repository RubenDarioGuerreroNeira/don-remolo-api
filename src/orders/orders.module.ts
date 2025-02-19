import { Module } from "@nestjs/common";
import { OrdersService } from "./orders.service";
import { OrdersController } from "./orders.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Order } from "../entities/order.entity";
import { Product } from "../entities/product.entity";
import { Category } from "../entities/category.entity";
import { WhatsappService } from "src/whatsapp/whatsapp.service";

@Module({
  imports: [TypeOrmModule.forFeature([Order, Product, Category])],
  controllers: [OrdersController],
  providers: [OrdersService, WhatsappService],
})
export class OrdersModule {}
