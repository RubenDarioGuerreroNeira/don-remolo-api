import { Module } from "@nestjs/common";
import { WhatsappService } from "./whatsapp.service";
import { WhatsappController } from "./whatsapp.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Order } from "../entities/order.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Order])],
  controllers: [WhatsappController],
  providers: [WhatsappService],
  exports: [WhatsappService],
})
export class WhatsappModule {}
