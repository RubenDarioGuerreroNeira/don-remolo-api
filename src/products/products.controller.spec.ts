import { Test, TestingModule } from "@nestjs/testing";
import { ProductsController } from "./products.controller";
import { ProductsService } from "./products.service";
import { CreateProductsDto } from "../dto/create-products.dto";
import { UpdateProductsDto } from "../dto/update-products";
import { PaginationDto } from "../dto/pagination.dto";
import {
  NotFoundException,
  ConflictException,
  BadRequestException,
} from "@nestjs/common";
import { Product } from "../entities/product.entity";
import { Category } from "../entities/category.entity";

describe("ProductsController", () => {
  let controller: ProductsController;
  let service: ProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductsService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            findByCategory: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
    service = module.get<ProductsService>(ProductsService);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("create", () => {
    it("should create a product successfully", async () => {
      // Arrange
      const createProductDto: CreateProductsDto = {
        name: "Test Product",
        price: 10,
        description: "Test Description",
        stockIn: 5,
        categoryId: "category-id",
        stockOut: 0,
      };

      // Create a proper mock of the Product entity with the correct Category structure
      const mockCategory = {
        id: "category-id",
        name: "Test Category",
        products: [],
      } as Category;

      const product = {
        id: "product-id",
        name: createProductDto.name,
        price: createProductDto.price,
        description: createProductDto.description,
        stockIn: createProductDto.stockIn,
        stockOut: createProductDto.stockOut,
        category: mockCategory,
      } as Product;

      jest.spyOn(service, "create").mockResolvedValue(product);

      // Act
      const result = await controller.create(createProductDto);

      // Assert
      expect(result).toEqual(product);
      expect(service.create).toHaveBeenCalledWith(createProductDto);
    });

    it("should handle ConflictException when product already exists", async () => {
      // Arrange
      const createProductDto: CreateProductsDto = {
        name: "Test Product",
        price: 10,
        description: "Test Description",
        stockIn: 5,
        categoryId: "category-id",
        stockOut: 0,
      };

      jest
        .spyOn(service, "create")
        .mockRejectedValue(new ConflictException("Product already exists"));

      // Act & Assert
      await expect(controller.create(createProductDto)).rejects.toThrow(
        ConflictException
      );
      expect(service.create).toHaveBeenCalledWith(createProductDto);
    });

    it("should handle BadRequestException when stockIn is negative", async () => {
      // Arrange
      const createProductDto: CreateProductsDto = {
        name: "Test Product",
        price: 10,
        description: "Test Description",
        stockIn: -5,
        categoryId: "category-id",
        stockOut: 0,
      };

      jest
        .spyOn(service, "create")
        .mockRejectedValue(
          new BadRequestException("StockIn must be greater than 0")
        );

      // Act & Assert
      await expect(controller.create(createProductDto)).rejects.toThrow(
        BadRequestException
      );
      expect(service.create).toHaveBeenCalledWith(createProductDto);
    });

    it("should handle NotFoundException when category does not exist", async () => {
      // Arrange
      const createProductDto: CreateProductsDto = {
        name: "Test Product",
        price: 10,
        description: "Test Description",
        stockIn: 5,
        categoryId: "non-existent-category",
        stockOut: 0,
      };

      jest
        .spyOn(service, "create")
        .mockRejectedValue(
          new NotFoundException(
            `Category with ID ${createProductDto.categoryId} not found`
          )
        );

      // Act & Assert
      await expect(controller.create(createProductDto)).rejects.toThrow(
        NotFoundException
      );
      expect(service.create).toHaveBeenCalledWith(createProductDto);
    });
  });

  describe("findAll", () => {
    it("should return paginated products", async () => {
      // Arrange
      const paginationDto: PaginationDto = { page: 2, limit: 10 };

      // Create proper mock products with correct Category structure
      const mockProducts = [
        {
          id: "product-1",
          name: "Product 1",
          price: 10,
          description: "Description 1",
          stockIn: 5,
          stockOut: 0,
          category: { id: "category-id", name: "Test Category", products: [] },
        },
        {
          id: "product-2",
          name: "Product 2",
          price: 20,
          description: "Description 2",
          stockIn: 10,
          stockOut: 0,
          category: { id: "category-id", name: "Test Category", products: [] },
        },
      ] as Product[];

      const paginatedResult = {
        items: mockProducts,
        total: 20,
        page: 2,
        limit: 10,
      };

      jest.spyOn(service, "findAll").mockResolvedValue(paginatedResult);

      // Act
      const result = await controller.findAll(paginationDto);

      // Assert
      expect(result).toEqual(paginatedResult);
      expect(service.findAll).toHaveBeenCalledWith(paginationDto);
    });

    it("should use default pagination values if not provided", async () => {
      // Arrange
      // Create proper mock products with correct Category structure
      const mockProducts = [
        {
          id: "product-1",
          name: "Product 1",
          price: 10,
          description: "Description 1",
          stockIn: 5,
          stockOut: 0,
          category: { id: "category-id", name: "Test Category", products: [] },
        },
        {
          id: "product-2",
          name: "Product 2",
          price: 20,
          description: "Description 2",
          stockIn: 10,
          stockOut: 0,
          category: { id: "category-id", name: "Test Category", products: [] },
        },
      ] as Product[];

      const paginatedResult = {
        items: mockProducts,
        total: 20,
        page: 1,
        limit: 10,
      };

      jest.spyOn(service, "findAll").mockResolvedValue(paginatedResult);

      // Act
      const result = await controller.findAll({});

      // Assert
      expect(result).toEqual(paginatedResult);
      expect(service.findAll).toHaveBeenCalledWith({});
    });
  });

  describe("findOne", () => {
    it("should return a product if it exists", async () => {
      // Arrange
      const productId = "product-id";
      const product = {
        id: productId,
        name: "Test Product",
        price: 10,
        description: "Test Description",
        stockIn: 5,
        stockOut: 0,
        category: { id: "category-id", name: "Test Category", products: [] },
      } as Product;

      jest.spyOn(service, "findOne").mockResolvedValue(product);

      // Act
      const result = await controller.findOne(productId);

      // Assert
      expect(result).toEqual(product);
      expect(service.findOne).toHaveBeenCalledWith(productId);
    });

    it("should handle NotFoundException if product does not exist", async () => {
      // Arrange
      const productId = "non-existent-id";

      jest
        .spyOn(service, "findOne")
        .mockRejectedValue(
          new NotFoundException(`Product with ID ${productId} not found`)
        );

      // Act & Assert
      await expect(controller.findOne(productId)).rejects.toThrow(
        NotFoundException
      );
      expect(service.findOne).toHaveBeenCalledWith(productId);
    });
  });

  describe("findByCategory", () => {
    it("should return paginated products by category", async () => {
      // Arrange
      const categoryId = "category-id";
      const paginationDto: PaginationDto = { page: 2, limit: 10 };

      // Create proper mock products with correct Category structure
      const mockCategory = {
        id: categoryId,
        name: "Test Category",
        products: [],
      };
      const mockProducts = [
        {
          id: "product-1",
          name: "Product 1",
          price: 10,
          description: "Description 1",
          stockIn: 5,
          stockOut: 0,
          category: mockCategory,
        },
        {
          id: "product-2",
          name: "Product 2",
          price: 20,
          description: "Description 2",
          stockIn: 10,
          stockOut: 0,
          category: mockCategory,
        },
      ] as Product[];

      const paginatedResult = {
        items: mockProducts,
        total: 20,
        page: 2,
        limit: 10,
      };

      jest.spyOn(service, "findByCategory").mockResolvedValue(paginatedResult);

      // Act
      const result = await controller.findByCategory(categoryId, paginationDto);

      // Assert
      expect(result).toEqual(paginatedResult);
      expect(service.findByCategory).toHaveBeenCalledWith(
        categoryId,
        paginationDto
      );
    });

    it("should handle NotFoundException if category does not exist", async () => {
      // Arrange
      const categoryId = "non-existent-category";
      const paginationDto: PaginationDto = { page: 1, limit: 10 };

      jest
        .spyOn(service, "findByCategory")
        .mockRejectedValue(
          new NotFoundException(`Category with ID ${categoryId} not found`)
        );

      // Act & Assert
      await expect(
        controller.findByCategory(categoryId, paginationDto)
      ).rejects.toThrow(NotFoundException);
      expect(service.findByCategory).toHaveBeenCalledWith(
        categoryId,
        paginationDto
      );
    });
  });

  describe("update", () => {
    it("should update a product successfully", async () => {
      // Arrange
      const productId = "product-id";
      const updateProductDto: UpdateProductsDto = {
        name: "Updated Product",
        price: 20,
        description: "Updated Description",
        categoryId: "category-id",
      };

      const updatedProduct = {
        id: productId,
        name: updateProductDto.name,
        price: updateProductDto.price,
        description: updateProductDto.description,
        stockIn: 5,
        stockOut: 0,
        category: { id: "category-id", name: "Test Category", products: [] },
      } as Product;

      jest.spyOn(service, "update").mockResolvedValue(updatedProduct);

      // Act
      const result = await controller.update(productId, updateProductDto);

      // Assert
      expect(result).toEqual(updatedProduct);
      expect(service.update).toHaveBeenCalledWith(productId, updateProductDto);
    });

    it("should handle NotFoundException if product does not exist", async () => {
      // Arrange
      const productId = "non-existent-id";
      const updateProductDto: UpdateProductsDto = {
        name: "Updated Product",
        price: 20,
        description: "Updated Description",
        categoryId: "category-id",
      };

      jest
        .spyOn(service, "update")
        .mockRejectedValue(
          new NotFoundException(`Product with ID ${productId} not found`)
        );

      // Act & Assert
      await expect(
        controller.update(productId, updateProductDto)
      ).rejects.toThrow(NotFoundException);
      expect(service.update).toHaveBeenCalledWith(productId, updateProductDto);
    });

    it("should handle NotFoundException if category does not exist", async () => {
      // Arrange
      const productId = "product-id";
      const updateProductDto: UpdateProductsDto = {
        name: "Updated Product",
        price: 20,
        description: "Updated Description",
        categoryId: "non-existent-category",
      };

      jest
        .spyOn(service, "update")
        .mockRejectedValue(
          new NotFoundException(
            `Category with ID ${updateProductDto.categoryId} not found`
          )
        );

      // Act & Assert
      await expect(
        controller.update(productId, updateProductDto)
      ).rejects.toThrow(NotFoundException);
      expect(service.update).toHaveBeenCalledWith(productId, updateProductDto);
    });
  });

  describe("remove", () => {
    it("should remove a product successfully", async () => {
      // Arrange
      const productId = "product-id";

      jest.spyOn(service, "remove").mockResolvedValue(undefined);

      // Act
      await controller.remove(productId);

      // Assert
      expect(service.remove).toHaveBeenCalledWith(productId);
    });

    it("should handle NotFoundException if product does not exist", async () => {
      // Arrange
      const productId = "non-existent-id";

      jest
        .spyOn(service, "remove")
        .mockRejectedValue(
          new NotFoundException(`Product with ID ${productId} not found`)
        );

      // Act & Assert
      await expect(controller.remove(productId)).rejects.toThrow(
        NotFoundException
      );
      expect(service.remove).toHaveBeenCalledWith(productId);
    });
  });
});
