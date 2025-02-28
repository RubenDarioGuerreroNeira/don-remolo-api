import { Injectable } from "@nestjs/common";
import { Order } from "../entities/order.entity";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class WhatsappService {
  private readonly localPhoneNumber: string;

  constructor(private configService: ConfigService) {
    this.localPhoneNumber =
      this.configService.get<string>("LOCAL_PHONE_NUMBER");
  }

  generateWhatsappLink(order: Order): string {
    const message = this.createWhatsappMessage(order);
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${this.localPhoneNumber}?text=${encodedMessage}`;
  }

  private createWhatsappMessage(order: Order): string {
    const items = order.items
      .map(
        (item) => `${item.quantity}x ${item.productName} - $${item.subtotal}`
      )
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
}

//---- ESTA VERSION ENVIA EL MENSAJE AUTOMATICO PERO NECESITA EL TOKEN---
// import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
// import { Order } from "../entities/order.entity";
// import axios from "axios";
// import { ConfigService } from "@nestjs/config";

// @Injectable()
// export class WhatsappService {
//   private readonly apiUrl = "https://graph.facebook.com/v17.0";
//   private readonly phoneNumberId: string;
//   private readonly accessToken: string;

//   constructor(private configService: ConfigService) {
//     this.phoneNumberId = this.configService.get<string>(
//       "WHATSAPP_PHONE_NUMBER_ID"
//     );
//     this.accessToken = this.configService.get<string>("WHATSAPP_ACCESS_TOKEN");

//     // Agrega estos logs para debugging
//     console.log("Config loaded:");
//     console.log("Phone Number ID:", this.phoneNumberId);
//     console.log("Access Token:", this.accessToken?.substring(0, 10) + "...");
//   }

//   async sendOrderNotification(order: Order): Promise<any> {
//     try {
//       const message = this.createWhatsappMessage(order);

//       // Log de la URL y datos que se enviarán
//       console.log(
//         "Sending request to:",
//         `${this.apiUrl}/${this.phoneNumberId}/messages`
//       );
//       console.log("Request data:", {
//         messaging_product: "whatsapp",
//         to: order.customerPhone,
//         type: "text",
//         text: { body: message },
//       });

//       const response = await axios.post(
//         `${this.apiUrl}/${this.phoneNumberId}/messages`,
//         {
//           messaging_product: "whatsapp",
//           to: order.customerPhone,
//           type: "text",
//           text: { body: message },
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${this.accessToken}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       return response.data;
//     } catch (error) {
//       // Mejorar el log del error
//       console.error("Full error:", error.response?.data || error);
//       throw new HttpException(
//         `Error sending WhatsApp message: ${
//           error.response?.data?.error?.message || error.message
//         }`,
//         HttpStatus.INTERNAL_SERVER_ERROR
//       );
//     }
//   }

//   private createWhatsappMessage(order: Order): string {
//     const items = order.items
//       .map(
//         (item) => `${item.quantity}x ${item.productName} - $${item.subtotal}`
//       )
//       .join("\n");

//     return `
// 🛍️ *Nuevo Pedido #${order.id.substring(0, 8)}*
// ------------------
// ${items}
// ------------------
// 💰 *Total:* $${order.total.toFixed(2)}

// 👤 *Cliente:* ${order.customerName}
// 📞 *Teléfono:* ${order.customerPhone}
// 📍 *Dirección:* ${order.customerAddress}

// 💵 *Pago:* Efectivo
// 🚚 *Envío:* Delivery propio del local
//     `.trim();
//   }
// }
