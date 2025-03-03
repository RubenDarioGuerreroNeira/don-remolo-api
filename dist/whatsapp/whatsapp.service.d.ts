import { Order } from "../entities/order.entity";
import { ConfigService } from "@nestjs/config";
export declare class WhatsappService {
    private configService;
    private readonly localPhoneNumber;
    constructor(configService: ConfigService);
    generateWhatsappLink(order: Order): string;
    private createWhatsappMessage;
}
