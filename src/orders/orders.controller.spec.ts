import { Test, TestingModule } from "@nestjs/testing";
import { OrdersController } from "./orders.controller";
import { OrdersService } from "./orders.service";
import { CreateOrderDto } from "../dto/create-order.dto";
import { OrderItem } from "src/interfaces/order-item.interfaces";

describe("OrdersController", () => {
  let controller: OrdersController;
  let service: OrdersService;

  const mockOrdersService = {
    create: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [
        {
          provide: OrdersService,
          useValue: mockOrdersService,
        },
      ],
    }).compile();

    controller = module.get<OrdersController>(OrdersController);
    service = module.get<OrdersService>(OrdersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("create", () => {
    it("should create an order successfully", async () => {
      // Arrange
      const createOrderDto: CreateOrderDto = {
        items: [
          {
            productId: "1",
            productName: "Pizza Margherita",
            quantity: 2,
            // price: 500,
            subtotal: 1000,
          },
        ],
        customerName: "John Doe",
        customerPhone: "1234567890",
        customerAddress: "Calle 123",
        // totalAmount: 1000,
        // status: "PENDING",
        // paymentMethod: "CASH",
      };

      const expectedResponse = {
        status: 201,
        message: "Order created successfully",
        data: {
          id: "1",
          ...createOrderDto,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      };

      mockOrdersService.create.mockResolvedValue(expectedResponse);

      // Act
      const result = await controller.create(createOrderDto);

      // Assert
      expect(result).toEqual(expectedResponse);
      expect(mockOrdersService.create).toHaveBeenCalledWith(createOrderDto);
      expect(mockOrdersService.create).toHaveBeenCalledTimes(1);
    });

    it("should handle errors when creating an order", async () => {
      // Arrange
      const createOrderDto: CreateOrderDto = {
        items: [
          {
            productId: "1",
            productName: "Pizza Margherita",
            quantity: 2,
            // price: 500,
            subtotal: 1000,
          },
        ],
        customerName: "John Doe",
        customerPhone: "1234567890",
        customerAddress: "Calle 123",
        // totalAmount: 1000,
        // status: "PENDING",
        // paymentMethod: "CASH",
      };

      const errorResponse = {
        status: 400,
        message: "Failed to create order",
        data: null,
      };

      mockOrdersService.create.mockResolvedValue(errorResponse);

      // Act
      const result = await controller.create(createOrderDto);

      // Assert
      expect(result).toEqual(errorResponse);
      expect(mockOrdersService.create).toHaveBeenCalledWith(createOrderDto);
    });
  });

  // describe("findOne", () => {
  //   it("should return a single order", async () => {
  //     // Arrange
  //     const orderId = "1";
  //     const expectedOrder = {
  //       id: orderId,
  //       products: [
  //         {
  //           productId: "1",
  //           productName: "Pizza Margherita",
  //           quantity: 2,
  //           price: 500,
  //           subtotal: 1000,
  //         },
  //       ],
  //       clientName: "John Doe",
  //       clientPhone: "1234567890",
  //       clientAddress: "Calle 123",
  //       totalAmount: 1000,
  //       status: "PENDING",
  //       paymentMethod: "CASH",
  //       createdAt: new Date(),
  //       updatedAt: new Date(),
  //     };

  //     mockOrdersService.findOne.mockResolvedValue(expectedOrder);

  //     // Act
  //     const result = await controller.findOne(orderId);

  //     // Assert
  //     expect(result).toEqual(expectedOrder);
  //     expect(mockOrdersService.findOne).toHaveBeenCalledWith(orderId);
  //   });

  //   it("should handle not found order", async () => {
  //     // Arrange
  //     const orderId = "non-existent-id";
  //     const errorResponse = {
  //       status: 404,
  //       message: "Order not found",
  //       data: null,
  //     };

  //     mockOrdersService.findOne.mockResolvedValue(errorResponse);

  //     // Act
  //     const result = await controller.findOne(orderId);

  //     // Assert
  //     expect(result).toEqual(errorResponse);
  //     expect(mockOrdersService.findOne).toHaveBeenCalledWith(orderId);
  //   });
  // });
});
