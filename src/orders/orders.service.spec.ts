import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { OrdersService } from "./orders.service";
import { WhatsappService } from "../whatsapp/whatsapp.service";
import { Order } from "../entities/order.entity";
import { Product } from "../entities/product.entity";
import { CreateOrderDto } from "../dto/create-order.dto";
import {
  NotFoundException,
  BadRequestException,
  ConflictException,
} from "@nestjs/common";

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

const createMockRepository = <T = any>(): MockRepository<T> => ({
  findOne: jest.fn(),
  findAndCount: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
});

describe("OrdersService", () => {
  let service: OrdersService;
  let ordersRepository: MockRepository<Order>;
  let productsRepository: MockRepository<Product>;
  let whatsappService: WhatsappService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: getRepositoryToken(Order),
          useValue: createMockRepository(),
        },
        {
          provide: getRepositoryToken(Product),
          useValue: createMockRepository(),
        },
        {
          provide: WhatsappService,
          useValue: {
            generateWhatsappLink: jest
              .fn()
              .mockReturnValue("https://wa.me/test-link"),
          },
        },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
    ordersRepository = module.get<MockRepository<Order>>(
      getRepositoryToken(Order)
    );
    productsRepository = module.get<MockRepository<Product>>(
      getRepositoryToken(Product)
    );
    whatsappService = module.get<WhatsappService>(WhatsappService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("create", () => {
    it("should create an order successfully", async () => {
      // Arrange
      const createOrderDto: CreateOrderDto = {
        items: [
          {
            productId: "product-id-1",
            productName: "Test Product 1",
            quantity: 2,
            subtotal: 20,
          },
          {
            productId: "product-id-2",
            productName: "Test Product 2",
            quantity: 1,
            subtotal: 15,
          },
        ],
        customerName: "Test Customer",
        customerPhone: "123-456-7890",
        customerAddress: "123 Test Street",
        total: 35,
      };

      const order = {
        id: "order-id",
        items: createOrderDto.items,
        customerName: createOrderDto.customerName,
        customerPhone: createOrderDto.customerPhone,
        customerAddress: createOrderDto.customerAddress,
        total: createOrderDto.total,
      };

      const product1 = {
        id: "product-id-1",
        name: "Test Product 1",
        price: 10,
        stockIn: 10,
      };

      const product2 = {
        id: "product-id-2",
        name: "Test Product 2",
        price: 15,
        stockIn: 10,
      };

      productsRepository.findOne.mockResolvedValueOnce(product1);
      productsRepository.findOne.mockResolvedValueOnce(product2);
      ordersRepository.create.mockReturnValue(order);
      ordersRepository.save.mockResolvedValue(order);

      // Act
      const result = await service.create(createOrderDto);

      // Assert
      expect(result).toEqual({
        order: {
          ...order,
        },
        whatsappLink: "https://wa.me/test-link",
      });
      expect(ordersRepository.create).toHaveBeenCalledWith({
        ...createOrderDto,
        total: 35, // Asegúrate de que el total sea correcto
      });
      expect(ordersRepository.save).toHaveBeenCalledWith(order);
    });

    it("should throw BadRequestException if items is empty", async () => {
      // Arrange
      const createOrderDto: CreateOrderDto = {
        items: [],
        customerName: "Test Customer",
        customerPhone: "123-456-7890",
        customerAddress: "123 Test Street",
        total: 0,
      };

      // Act & Assert
      await expect(service.create(createOrderDto)).rejects.toThrow(
        BadRequestException
      );
    });
  });
});
