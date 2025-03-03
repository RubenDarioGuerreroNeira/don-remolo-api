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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const order_entity_1 = require("../entities/order.entity");
const product_entity_1 = require("../entities/product.entity");
const whatsapp_service_1 = require("../whatsapp/whatsapp.service");
let OrdersService = class OrdersService {
    constructor(ordersRepository, whatsappService, productRepository) {
        this.ordersRepository = ordersRepository;
        this.whatsappService = whatsappService;
        this.productRepository = productRepository;
    }
    async validateProduct(items) {
        if (items.length === 0) {
            throw new common_1.BadRequestException("Items are required");
        }
        let total = 0;
        for (const item of items) {
            const product = await this.productRepository.findOne({
                where: { id: item.productId },
            });
            if (!product) {
                throw new common_1.BadRequestException("Product does not exist");
            }
            if (product.stockIn < item.quantity) {
                throw new common_1.BadRequestException("Product is out of stock");
            }
            total += product.price * item.quantity;
            product.stockIn -= item.quantity;
            await this.productRepository.save(product);
        }
        return total;
    }
    async create(createOrderDto) {
        const total = await this.validateProduct(createOrderDto.items);
        const order = this.ordersRepository.create({
            ...createOrderDto,
            total,
        });
        const savedOrder = await this.ordersRepository.save(order);
        const whatsappLink = this.whatsappService.generateWhatsappLink(savedOrder);
        return {
            order: savedOrder,
            whatsappLink,
        };
    }
    async findOne(orderId) {
        try {
            const order = await this.ordersRepository.findOne({
                where: { id: orderId },
            });
            return order || null;
        }
        catch (e) {
            return null;
        }
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __param(2, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        whatsapp_service_1.WhatsappService,
        typeorm_2.Repository])
], OrdersService);
//# sourceMappingURL=orders.service.js.map