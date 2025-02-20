import { Injectable } from "@nestjs/common";
import { Order } from "../entities/order.entity";

@Injectable()
export class WhatsappService {
  private readonly WHATSAPP_BUSINESS_NUMBER = "5804160897020"; // Quita el + del número

  async sendOrderNotification(order: Order): Promise<any> {
    const message = this.createWhatsappMessage(order);
    const whatsappLink = this.generateWhatsappLink(message);
    return whatsappLink;
  }

  private createWhatsappMessage(order: Order): string {
    // Formatear los items usando solo la información disponible
    const items = order.items.map((item)=>{
      return `${item.quantity}x ${item.productName} - $${item.subtotal}`;
    }).join("\n");
      
      

    return `
🛍️ *Nuevo Pedido #${order.id.substring(0, 8)}*
------------------
${items}
------------------
💰 *Total:* $${order.total.toFixed(2)}

👤 *Cliente:* ${order.customerName}
📞 *Teléfono:* ${order.customerPhone}
📍 *Dirección:* ${order.customerAddress}

💵 *Pago:* Efectivo
🚚 *Envío:* Delivery propio del local
    `.trim();
  }

  private generateWhatsappLink(message: string): string {
    return `https://api.whatsapp.com/send?phone=${
      this.WHATSAPP_BUSINESS_NUMBER
    }&text=${encodeURIComponent(message)}`;
  }
}


// @Injectable()
// export class WhatsappService {
  // private readonly WHATSAPP_BUSINESS_NUMBER = "+5804160897020";
  
//   async sendOrderNotification(order: Order): Promise<any> {
//     const message = this.createWhatsappMessage(order);
//     const whatsappLink = this.generateWhatsappLink(message);
//     return whatsappLink;
//   }

//   private createWhatsappMessage(order: Order): string {
//     const items = order.items
//       .map(
//         (item) => `${item.quantity}x ${item.productName} - $${item.subtotal}`
//       )
//       .join("\n");

//     return `
// 🛍️ *Nuevo Pedido #${order.id}*
// ------------------
// ${items}
// ------------------
// 💰 *Total:* $${order.total}

// 👤 *Cliente:* ${order.customerName}
// 📞 *Teléfono:* ${order.customerPhone}
// 📍 *Dirección:* ${order.customerAddress}

// 💵 *Pago:* Efectivo
// 🚚 *Envío:* Delivery propio del local
//     `.trim();
//   }

//   private generateWhatsappLink(message: string): string {
//     return `https://api.whatsapp.com/send?phone=${
//       this.WHATSAPP_BUSINESS_NUMBER
//     }&text=${encodeURIComponent(message)}`;
//   }
// }
