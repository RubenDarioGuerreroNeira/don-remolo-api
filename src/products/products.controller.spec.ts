import { Test, TestingModule } from "@nestjs/testing";
import { ProductsController } from "./products.controller";
import { ProductsService } from "./products.service";
import { CreateProductsDto } from "../dto/create-products.dto";

describe("ProductsController", () => {
  let controller: ProductsController;
  let service: ProductsService;

  // Mock del ProductsService
  const mockProductsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findByCategory: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductsService,
          useValue: mockProductsService,
        },
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
    service = module.get<ProductsService>(ProductsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("create", () => {
    it("should create a product", async () => {
      const createProductDto: CreateProductsDto = {
        name: "Test Product",
        description: "Test Description",
        price: 100,
        stockIn: 10,
        stockOut: 0,
        categoryId: "1",
        idCategory: "",
      };

      const expectedResponse = {
        status: 200,
        message: "Product created successfully",
        data: {
          id: "1",
          ...createProductDto,
          category: { id: "1" },
        },
      };

      mockProductsService.create.mockResolvedValue(expectedResponse);

      const result = await controller.create(createProductDto);

      expect(result).toEqual(expectedResponse);
      expect(mockProductsService.create).toHaveBeenCalledWith(createProductDto);
    });
  });

  describe("findAll", () => {
    it("should return all products", async () => {
      const expectedProducts = [
        {
          id: "1",
          name: "Test Product",
          description: "Test Description",
          price: 100,
          stockIn: 10,
          stockOut: 0,
          category: { id: "1", name: "Test Category" },
        },
      ];

      mockProductsService.findAll.mockResolvedValue(expectedProducts);

      const result = await controller.findAll();

      expect(result).toEqual(expectedProducts);
      expect(mockProductsService.findAll).toHaveBeenCalled();
    });
  });

  describe("findByCategory", () => {
    it("should return products by category", async () => {
      const categoryId = "1";
      const expectedProducts = [
        {
          id: "1",
          name: "Test Product",
          description: "Test Description",
          price: 100,
          stockIn: 10,
          stockOut: 0,
          category: { id: categoryId, name: "Test Category" },
        },
      ];

      mockProductsService.findByCategory.mockResolvedValue(expectedProducts);

      const result = await controller.findByCategory(categoryId);

      expect(result).toEqual(expectedProducts);
      expect(mockProductsService.findByCategory).toHaveBeenCalledWith(
        categoryId
      );
    });
  });
});

// import { Test, TestingModule } from '@nestjs/testing';
// import { ProductsController } from './products.controller';
// import { ProductsService } from './products.service';
// import { CreateProductsDto } from '../dto/create-products.dto';

// describe('ProductsController', () => {
//   let controller: ProductsController;
//   let service: ProductsService;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       controllers: [ProductsController],
//       providers: [ProductsService],
//     }).compile();

//     controller = module.get<ProductsController>(ProductsController);
//   });

//   it('should be defined', () => {
//     expect(controller).toBeDefined();
//   });
// });
