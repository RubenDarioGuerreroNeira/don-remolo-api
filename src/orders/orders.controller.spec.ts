import { Test, TestingModule } from "@nestjs/testing";
import { OrdersController } from "./orders.controller";
import { OrdersService } from "./orders.service";
import { WhatsappService } from "../whatsapp/whatsapp.service";
import { CreateOrderDto } from "../dto/create-order.dto";
import { WhatsappResponse } from "../interfaces/whatsappResponse";
import { NotFoundException } from "@nestjs/common";
import { create } from "domain";

describe("OrdersController", () => {
  let controller: OrdersController;
  let ordersService: OrdersService;
  let whatsappService: WhatsappService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [
        {
          provide: OrdersService,
          useValue: {
            create: jest.fn(),
            findOne: jest.fn(),
          },
        },
        {
          provide: WhatsappService,
          useValue: {
            generateWhatsappLink: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<OrdersController>(OrdersController);
    ordersService = module.get<OrdersService>(OrdersService);
    whatsappService = module.get<WhatsappService>(WhatsappService);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("create", () => {
    it("should create an order and return a WhatsappResponse", async () => {
      // Arrange
      const createOrderDto: CreateOrderDto = {
        items: [
          {
            productId: "product-id-1",
            productName: "Test Product 1",
            quantity: 2,
            subtotal: 20,
          },
        ],
        customerName: "Test Customer",
        customerPhone: "123-456-7890",
        customerAddress: "123 Test Street",
        total: 20,
      };
      const whatsappLink = 'https://wa.me/?text=Order%20Details';

      const expectedResponse: WhatsappResponse = {
        order: {
          id: "order-id",
          items: createOrderDto.items,
          customerName: createOrderDto.customerName,
          customerPhone: createOrderDto.customerPhone,
          customerAddress: createOrderDto.customerAddress,
          total: createOrderDto.total,
          createdAt: new Date(),
                 },
                 whatsappLink,
      };

      jest.spyOn(ordersService, "create").mockResolvedValue(expectedResponse);

      // Act
      const result = await controller.create(createOrderDto);

      // Assert
      expect(result).toEqual(expectedResponse);
      expect(ordersService.create).toHaveBeenCalledWith(createOrderDto);
    });
  });

  describe('checkout', () => {
    it('should return a WhatsappResponse with order and whatsappLink', async () => {
      // Arrange
      const orderId = 'order-id';
      const order = {
        id: orderId,
        items: [],
        customerName: 'Test Customer',
        customerPhone: '123-456-7890',
        customerAddress: '123 Test Street',
        total: 20,
        createdAt: new Date(), // Asegúrate de incluir createdAt
      };
  
      const whatsappLink = 'https://wa.me/?text=Order%20Details';
  
      jest.spyOn(ordersService, 'findOne').mockResolvedValue(order);
      jest.spyOn(whatsappService, 'generateWhatsappLink').mockReturnValue(whatsappLink);
  
      // Act
      const result = await controller.checkout(orderId);
  
      // Assert
      expect(result).toEqual({ order, whatsappLink }); // Asegúrate de incluir whatsappLink en el resultado esperado
      expect(ordersService.findOne).toHaveBeenCalledWith(orderId);
      expect(whatsappService.generateWhatsappLink).toHaveBeenCalledWith(order);
    });
  
    it('should throw NotFoundException if order does not exist', async () => {
      // Arrange
      const orderId = 'non-existent-id';
  
      jest.spyOn(ordersService, 'findOne').mockResolvedValue(null);
  
      // Act & Assert
      await expect(controller.checkout(orderId)).rejects.toThrow(NotFoundException);
      expect(ordersService.findOne).toHaveBeenCalledWith(orderId);
    });
  });
});
