"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WhatsappService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let WhatsappService = class WhatsappService {
    constructor(configService) {
        this.configService = configService;
        this.localPhoneNumber =
            this.configService.get("LOCAL_PHONE_NUMBER");
    }
    generateWhatsappLink(order) {
        const message = this.createWhatsappMessage(order);
        const encodedMessage = encodeURIComponent(message);
        return `https://wa.me/${this.localPhoneNumber}?text=${encodedMessage}`;
    }
    createWhatsappMessage(order) {
        const items = order.items
            .map((item) => `${item.quantity}x ${item.productName} - $${item.subtotal}`)
            .join("\n");
        return `
🛍️ *Nuevo Pedido*
------------------
${items}
------------------
💰 *Total:* $${order.total.toFixed(2)}

👤 *Cliente:* ${order.customerName}
📞 *Teléfono:* ${order.customerPhone}
📍 *Dirección:* ${order.customerAddress}

💵 *Pago:* Efectivo
🚚 *Envío:* Delivery propio del local`.trim();
    }
};
exports.WhatsappService = WhatsappService;
exports.WhatsappService = WhatsappService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], WhatsappService);
//# sourceMappingURL=whatsapp.service.js.map