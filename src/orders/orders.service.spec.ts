import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { OrdersService } from "./orders.service";
import { Order } from "../entities/order.entity";
import { Product } from "../entities/product.entity";
import { WhatsappService } from "../whatsapp/whatsapp.service";
import { BadRequestException } from "@nestjs/common";
import { OrderItem } from "../interfaces/order-item.interfaces";
import { CreateOrderDto } from "../dto/create-order.dto";

describe("OrdersService", () => {
  let service: OrdersService;
  let orderRepository: Repository<Order>;
  let productRepository: Repository<Product>;
  let whatsappService: WhatsappService;

  const mockOrderRepository = {
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockProductRepository = {
    findOne: jest.fn(),
    save: jest.fn(),
  };

  const mockWhatsappService = {
    sendOrderNotification: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: getRepositoryToken(Order),
          useValue: mockOrderRepository,
        },
        {
          provide: getRepositoryToken(Product),
          useValue: mockProductRepository,
        },
        {
          provide: WhatsappService,
          useValue: mockWhatsappService,
        },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
    orderRepository = module.get<Repository<Order>>(getRepositoryToken(Order));
    productRepository = module.get<Repository<Product>>(
      getRepositoryToken(Product)
    );
    whatsappService = module.get<WhatsappService>(WhatsappService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("validateProduct", () => {
    it("should throw BadRequestException if items array is empty", async () => {
      const items: OrderItem[] = [];

      await expect(service.validateProduct(items)).rejects.toThrow(
        new BadRequestException("Items are required")
      );
    });

    it("should throw BadRequestException if product does not exist", async () => {
      const items: OrderItem[] = [
        {
          productId: "1",
          productName: "Non-existent Product",
          quantity: 1,
          subtotal: 100,
        },
      ];

      mockProductRepository.findOne.mockResolvedValue(null);

      await expect(service.validateProduct(items)).rejects.toThrow(
        new BadRequestException("Product does not exist")
      );
    });

    it("should throw BadRequestException if product is out of stock", async () => {
      const items: OrderItem[] = [
        {
          productId: "1",
          productName: "Test Product",
          quantity: 5,
          subtotal: 500,
        },
      ];

      mockProductRepository.findOne.mockResolvedValue({
        id: "1",
        name: "Test Product",
        price: 100,
        stockIn: 3,
      });

      await expect(service.validateProduct(items)).rejects.toThrow(
        new BadRequestException("Product is out of stock")
      );
    });

    it("should calculate total and update stock correctly", async () => {
      const items: OrderItem[] = [
        {
          productId: "1",
          productName: "Test Product",
          quantity: 2,
          subtotal: 200,
        },
      ];

      const product = {
        id: "1",
        name: "Test Product",
        price: 100,
        stockIn: 5,
      };

      mockProductRepository.findOne.mockResolvedValue(product);
      mockProductRepository.save.mockResolvedValue({
        ...product,
        stockIn: 3,
      });

      const total = await service.validateProduct(items);

      expect(total).toBe(200);
      expect(mockProductRepository.save).toHaveBeenCalledWith({
        ...product,
        stockIn: 3,
      });
    });
  });

  describe("create", () => {
    it("should create order successfully", async () => {
      const createOrderDto: CreateOrderDto = {
        items: [
          {
            productId: "1",
            productName: "Test Product",
            quantity: 2,
            subtotal: 200,
          },
        ],
        customerName: "John Doe",
        customerPhone: "1234567890",
        customerAddress: "Test Address",
      };

      const product = {
        id: "1",
        name: "Test Product",
        price: 100,
        stockIn: 5,
      };

      const savedOrder = {
        id: "1",
        ...createOrderDto,
        total: 200,
      };

      mockProductRepository.findOne.mockResolvedValue(product);
      mockProductRepository.save.mockResolvedValue({ ...product, stockIn: 3 });
      mockOrderRepository.create.mockReturnValue(savedOrder);
      mockOrderRepository.save.mockResolvedValue(savedOrder);
      mockWhatsappService.sendOrderNotification.mockResolvedValue(true);

      const result = await service.create(createOrderDto);

      expect(result).toEqual(savedOrder);
      expect(mockOrderRepository.create).toHaveBeenCalledWith({
        ...createOrderDto,
        total: 200,
      });
      expect(mockOrderRepository.save).toHaveBeenCalledWith(savedOrder);
      expect(mockWhatsappService.sendOrderNotification).toHaveBeenCalledWith(
        savedOrder
      );
    });

    it("should throw error if validation fails", async () => {
      const createOrderDto: CreateOrderDto = {
        items: [],
        customerName: "John Doe",
        customerPhone: "1234567890",
        customerAddress: "Test Address",
      };

      await expect(service.create(createOrderDto)).rejects.toThrow(
        new BadRequestException("Items are required")
      );
    });
  });
});
