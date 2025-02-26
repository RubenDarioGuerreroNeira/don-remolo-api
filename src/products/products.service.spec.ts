import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ProductsService } from "./products.service";
import { Product } from "src/entities/product.entity";
import { Category } from "src/entities/category.entity";
import { CreateProductsDto } from "../dto/create-products.dto";

describe("ProductsService", () => {
  let service: ProductsService;
  let productRepository: Repository<Product>;
  let categoryRepository: Repository<Category>;

  const mockProductRepository = {
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
  };

  const mockCategoryRepository = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(Product),
          useValue: mockProductRepository,
        },
        {
          provide: getRepositoryToken(Category),
          useValue: mockCategoryRepository,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    productRepository = module.get<Repository<Product>>(
      getRepositoryToken(Product)
    );
    categoryRepository = module.get<Repository<Category>>(
      getRepositoryToken(Category)
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("validateProducts", () => {
    it("should throw error if name is missing", async () => {
      const productDto: CreateProductsDto = {
        name: "",
        description: "test",
        price: 100,
        stockIn: 10,
        stockOut: 0,
        categoryId: "1",
        idCategory: "",
      };

      await expect(service.validateProducts(productDto)).rejects.toThrow(
        "Product name is required"
      );
    });

    it("should throw error if required data is missing", async () => {
      const productDto: CreateProductsDto = {
        name: "Test Product",
        description: "",
        price: 0,
        stockIn: 0,
        stockOut: 0,
        categoryId: "1",
        idCategory: "",
      };

      await expect(service.validateProducts(productDto)).rejects.toThrow(
        "Product data is required"
      );
    });

    it("should throw error if stockIn is less than 0", async () => {
      const productDto: CreateProductsDto = {
        name: "Test Product",
        description: "test",
        price: 100,
        stockIn: -1,
        stockOut: 0,
        categoryId: "1",
        idCategory: "",
      };

      await expect(service.validateProducts(productDto)).rejects.toThrow(
        "StockIn must be greater than 0"
      );
    });

    it("should throw error if product already exists", async () => {
      const productDto: CreateProductsDto = {
        name: "Existing Product",
        description: "test",
        price: 100,
        stockIn: 10,
        stockOut: 0,
        categoryId: "1",
        idCategory: "",
      };

      mockProductRepository.findOne.mockResolvedValue({
        id: "1",
        ...productDto,
      });

      await expect(service.validateProducts(productDto)).rejects.toThrow(
        "Product already exists"
      );
    });
  });

  describe("validateCategory", () => {
    it("should throw error if category does not exist", async () => {
      const categoryId = "999";
      mockCategoryRepository.findOne.mockResolvedValue(null);

      await expect(service.validateCategory(categoryId)).rejects.toThrow(
        "Category does not exist"
      );
    });
  });

  describe("create", () => {
    it("should create product successfully", async () => {
      const createProductDto: CreateProductsDto = {
        name: "New Product",
        description: "test",
        price: 100,
        stockIn: 10,
        stockOut: 0,
        categoryId: "1",
        idCategory: "",
      };

      mockProductRepository.findOne.mockResolvedValue(null);
      mockCategoryRepository.findOne.mockResolvedValue({
        id: "1",
        name: "Test Category",
      });

      const savedProduct = {
        id: "1",
        ...createProductDto,
        category: { id: createProductDto.categoryId },
      };
      mockProductRepository.save.mockResolvedValue(savedProduct);

      const result = await service.create(createProductDto);

      expect(result).toEqual({
        data: savedProduct,
        message: "Product created successfully",
        status: 200,
      });
    });

    it("should handle errors during creation", async () => {
      const createProductDto: CreateProductsDto = {
        name: "",
        description: "test",
        price: 100,
        stockIn: 10,
        stockOut: 0,
        categoryId: "1",
        idCategory: "",
      };

      const result = await service.create(createProductDto);

      expect(result).toEqual({
        data: null,
        message: "Product name is required",
        status: 400,
      });
    });
  });

  describe("findAll", () => {
    it("should return all products", async () => {
      const expectedProducts = [
        {
          id: "1",
          name: "Test Product",
          description: "test",
          price: 100,
          stockIn: 10,
          stockOut: 0,
          category: { id: "1", name: "Test Category" },
        },
      ];

      mockProductRepository.find.mockResolvedValue(expectedProducts);

      const result = await service.findAll();

      expect(result).toEqual(expectedProducts);
      expect(mockProductRepository.find).toHaveBeenCalledWith({
        relations: ["category"],
      });
    });
  });

  describe("findByCategory", () => {
    it("should return products by category", async () => {
      const categoryId = "1";
      const expectedProducts = [
        {
          id: "1",
          name: "Test Product",
          description: "test",
          price: 100,
          stockIn: 10,
          stockOut: 0,
          category: { id: categoryId, name: "Test Category" },
        },
      ];

      mockProductRepository.find.mockResolvedValue(expectedProducts);

      const result = await service.findByCategory(categoryId);

      expect(result).toEqual(expectedProducts);
      expect(mockProductRepository.find).toHaveBeenCalledWith({
        where: { category: { id: categoryId } },
        relations: ["category"],
      });
    });
  });
});
