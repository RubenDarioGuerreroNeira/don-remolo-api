// src/products/products.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductsService } from './products.service';
import { Product } from '../entities/product.entity';
import { Category } from '../entities/category.entity';
import { CreateProductsDto } from '../dto/create-products.dto';
import { UpdateProductsDto } from '../dto/update-products';
import { PaginationDto } from '../dto/pagination.dto';
import {
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

const createMockRepository = <T = any>(): MockRepository<T> => ({
  findOne: jest.fn(),
  findAndCount: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
});

describe('ProductsService', () => {
  let service: ProductsService;
  let productsRepository: MockRepository<Product>;
  let categoriesRepository: MockRepository<Category>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(Product),
          useValue: createMockRepository(),
        },
        {
          provide: getRepositoryToken(Category),
          useValue: createMockRepository(),
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    productsRepository = module.get<MockRepository<Product>>(
      getRepositoryToken(Product),
    );
    categoriesRepository = module.get<MockRepository<Category>>(
      getRepositoryToken(Category),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a product successfully', async () => {
      // Arrange
      const createProductDto: CreateProductsDto = {
        name: 'Test Product',
        price: 10,
        description: 'Test Description',
        stockIn: 5,
        categoryId: 'category-id',
        stockOut: 0,
      };

      const category = {
        id: 'category-id',
        name: 'Test Category',
        products: [], // Added products property
      };

      const product = {
        id: 'product-id',
        name: createProductDto.name,
        price: createProductDto.price,
        description: createProductDto.description,
        stockIn: createProductDto.stockIn,
        stockOut: createProductDto.stockOut,
        category,
      };

      productsRepository.findOne.mockResolvedValue(null);
      categoriesRepository.findOne.mockResolvedValue(category);
      productsRepository.create.mockReturnValue(product);
      productsRepository.save.mockResolvedValue(product);

      // Act
      const result = await service.create(createProductDto);

      // Assert
      expect(result).toEqual(product);
      expect(productsRepository.findOne).toHaveBeenCalledWith({
        where: { name: createProductDto.name },
      });
      expect(categoriesRepository.findOne).toHaveBeenCalledWith({
        where: { id: createProductDto.categoryId },
      });
      expect(productsRepository.create).toHaveBeenCalledWith({
        ...createProductDto,
        category: { id: createProductDto.categoryId },
      });
      expect(productsRepository.save).toHaveBeenCalledWith(product);
    });

    it('should throw ConflictException when product already exists', async () => {
      // Arrange
      const createProductDto: CreateProductsDto = {
        name: 'Test Product',
        price: 10,
        description: 'Test Description',
        stockIn: 5,
        categoryId: 'category-id',
        stockOut: 0,
      };

      const existingProduct = {
        id: 'product-id',
        name: createProductDto.name,
        category: { id: 'category-id', name: 'Test Category', products: [] }, // Added category property
      };

      productsRepository.findOne.mockResolvedValue(existingProduct);

      // Act & Assert
      await expect(service.create(createProductDto)).rejects.toThrow(
        ConflictException,
      );
      expect(productsRepository.findOne).toHaveBeenCalledWith({
        where: { name: createProductDto.name },
      });
    });

    it('should throw BadRequestException when stockIn is negative', async () => {
      // Arrange
      const createProductDto: CreateProductsDto = {
        name: 'Test Product',
        price: 10,
        description: 'Test Description',
        stockIn: -5,
        categoryId: 'category-id',
        stockOut: 0,
      };

      productsRepository.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(service.create(createProductDto)).rejects.toThrow(
        BadRequestException,
      );
      expect(productsRepository.findOne).toHaveBeenCalledWith({
        where: { name: createProductDto.name },
      });
    });

    it('should throw NotFoundException when category does not exist', async () => {
      // Arrange
      const createProductDto: CreateProductsDto = {
        name: 'Test Product',
        price: 10,
        description: 'Test Description',
        stockIn: 5,
        categoryId: 'non-existent-category',
        stockOut: 0,
      };

      productsRepository.findOne.mockResolvedValue(null);
      categoriesRepository.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(service.create(createProductDto)).rejects.toThrow(
        NotFoundException,
      );
      expect(productsRepository.findOne).toHaveBeenCalledWith({
        where: { name: createProductDto.name },
      });
      expect(categoriesRepository.findOne).toHaveBeenCalledWith({
        where: { id: createProductDto.categoryId },
      });
    });
  });

  describe('findAll', () => {
    it('should return paginated products', async () => {
      // Arrange
      const paginationDto: PaginationDto = { page: 2, limit: 10 };
      const products = [
        {
          id: 'product-1',
          name: 'Product 1',
          category: { id: 'category-id', name: 'Test Category', products: [] }, // Added products property
        },
        {
          id: 'product-2',
          name: 'Product 2',
          category: { id: 'category-id', name: 'Test Category', products: [] }, // Added products property
        },
      ];
      const total = 20;

      productsRepository.findAndCount.mockResolvedValue([products, total]);

      // Act
      const result = await service.findAll(paginationDto);

      // Assert
      expect(result).toEqual({
        items: products,
        total,
        page: paginationDto.page,
        limit: paginationDto.limit,
      });
      expect(productsRepository.findAndCount).toHaveBeenCalledWith({
        relations: ['category'],
        skip: (paginationDto.page - 1) * paginationDto.limit,
        take: paginationDto.limit,
      });
    });

    it('should use default pagination values if not provided', async () => {
      // Arrange
      const products = [
        {
          id: 'product-1',
          name: 'Product 1',
          category: { id: 'category-id', name: 'Test Category', products: [] }, // Added products property
        },
      ];
      const total = 1;

      productsRepository.findAndCount.mockResolvedValue([products, total]);

      // Act
      const result = await service.findAll();

      // Assert
      expect(result).toEqual({
        items: products,
        total,
        page: 1,
        limit: 10,
      });
      expect(productsRepository.findAndCount).toHaveBeenCalledWith({
        relations: ['category'],
        skip: 0,
        take: 10,
      });
    });
  });

  describe('findOne', () => {
    it('should return a product if it exists', async () => {
      // Arrange
      const productId = 'product-id';
      const product = {
        id: productId,
        name: 'Test Product',
        category: { id: 'category-id', name: 'Test Category', products: [] }, // Added products property
      };

      productsRepository.findOne.mockResolvedValue(product);

      // Act
      const result = await service.findOne(productId);

      // Assert
      expect(result).toEqual(product);
      expect(productsRepository.findOne).toHaveBeenCalledWith({
        where: { id: productId },
        relations: ['category'],
      });
    });

    it('should throw NotFoundException if product does not exist', async () => {
      // Arrange
      const productId = 'non-existent-id';

      productsRepository.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(service.findOne(productId)).rejects.toThrow(
        NotFoundException,
      );
      expect(productsRepository.findOne).toHaveBeenCalledWith({
        where: { id: productId },
        relations: ['category'],
      });
    });
  });

  describe('findByCategory', () => {
    it('should return paginated products by category', async () => {
      // Arrange
      const categoryId = 'category-id';
      const paginationDto: PaginationDto = { page: 2, limit: 10 };
      const category = {
        id: categoryId,
        name: 'Test Category',
        products: [], // Added products property
      };
      const products = [
        {
          id: 'product-1',
          name: 'Product 1',
          category,
        },
        {
          id: 'product-2',
          name: 'Product 2',
          category,
        },
      ];
      const total = 20;

      categoriesRepository.findOne.mockResolvedValue(category);
      productsRepository.findAndCount.mockResolvedValue([products, total]);

      // Act
      const result = await service.findByCategory(categoryId, paginationDto);

      // Assert
      expect(result).toEqual({
        items: products,
        total,
        page: paginationDto.page,
        limit: paginationDto.limit,
      });
      expect(categoriesRepository.findOne).toHaveBeenCalledWith({
        where: { id: categoryId },
      });
      expect(productsRepository.findAndCount).toHaveBeenCalledWith({
        where: { category: { id: categoryId } },
        relations: ['category'],
        skip: (paginationDto.page - 1) * paginationDto.limit,
        take: paginationDto.limit,
      });
    });

    it('should throw NotFoundException if category does not exist', async () => {
      // Arrange
      const categoryId = 'non-existent-category';
      const paginationDto: PaginationDto = { page: 1, limit: 10 };

      categoriesRepository.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(
        service.findByCategory(categoryId, paginationDto),
      ).rejects.toThrow(NotFoundException);
      expect(categoriesRepository.findOne).toHaveBeenCalledWith({
        where: { id: categoryId },
      });
    });
  });

  describe('update', () => {
    it('should update a product successfully', async () => {
      // Arrange
      const productId = 'product-id';
      const updateProductDto: UpdateProductsDto = {
        name: 'Updated Product',
        price: 20,
        description: 'Updated Description',
        categoryId: 'category-id',
      };

      const existingProduct = {
        id: productId,
        name: 'Test Product',
        price: 10,
        description: 'Test Description',
        category: { id: 'old-category-id', name: 'Old Category', products: [] }, // Added products property
      };

      const category = {
        id: updateProductDto.categoryId,
        name: 'Test Category',
        products: [], // Added products property
      };

      const updatedProduct = {
        ...existingProduct,
        name: updateProductDto.name,
        price: updateProductDto.price,
        description: updateProductDto.description,
        category,
      };

      productsRepository.findOne
        .mockResolvedValueOnce(existingProduct)
        .mockResolvedValueOnce(updatedProduct);
      categoriesRepository.findOne.mockResolvedValue(category);
      productsRepository.update.mockResolvedValue({ affected: 1 });
      productsRepository.save.mockResolvedValue({
        id: productId,
        category: { id: updateProductDto.categoryId },
      });

      // Act
      const result = await service.update(productId, updateProductDto);

      // Assert
      expect(result).toEqual(updatedProduct);
      expect(productsRepository.findOne).toHaveBeenCalledWith({
        where: { id: productId },
        relations: ['category'],
      });
      expect(categoriesRepository.findOne).toHaveBeenCalledWith({
        where: { id: updateProductDto.categoryId },
      });
      expect(productsRepository.update).toHaveBeenCalledWith(productId, {
        name: updateProductDto.name,
        price: updateProductDto.price,
        description: updateProductDto.description,
      });
      expect(productsRepository.save).toHaveBeenCalledWith({
        id: productId,
        category: { id: updateProductDto.categoryId },
      });
    });

    it('should throw NotFoundException if product does not exist', async () => {
      // Arrange
      const productId = 'non-existent-id';
      const updateProductDto: UpdateProductsDto = {
        name: 'Updated Product',
        price: 20,
        description: 'Updated Description',
        categoryId: 'category-id',
      };

      productsRepository.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(service.update(productId, updateProductDto)).rejects.toThrow(
        NotFoundException,
      );
      expect(productsRepository.findOne).toHaveBeenCalledWith({
        where: { id: productId },
        relations: ['category'],
      });
    });

    it('should throw NotFoundException if category does not exist', async () => {
      // Arrange
      const productId = 'product-id';
      const updateProductDto: UpdateProductsDto = {
        name: 'Updated Product',
        price: 20,
        description: 'Updated Description',
        categoryId: 'non-existent-category',
      };

      const existingProduct = {
        id: productId,
        name: 'Test Product',
        price: 10,
        description: 'Test Description',
        category: { id: 'old-category-id', name: 'Old Category', products: [] }, // Added products property
      };

      productsRepository.findOne.mockResolvedValue(existingProduct);
      categoriesRepository.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(service.update(productId, updateProductDto)).rejects.toThrow(
        NotFoundException,
      );
      expect(productsRepository.findOne).toHaveBeenCalledWith({
        where: { id: productId },
        relations: ['category'],
      });
    });
  });

  describe('remove', () => {
    it('should remove a product successfully', async () => {
      // Arrange
      const productId = 'product-id';
      productsRepository.findOne.mockResolvedValue({ id: productId });
      productsRepository.delete.mockResolvedValue({ affected: 1 }); // Mock the delete method

      // Act
      await service.remove(productId);

      // Assert
      expect(productsRepository.delete).toHaveBeenCalledWith(productId); // Verify delete is called
    });

    it('should throw NotFoundException if product does not exist', async () => {
      // Arrange
      const productId = 'non-existent-id';
      productsRepository.findOne.mockResolvedValue(null);
  
      // Act & Assert
      await expect(service.remove(productId)).rejects.toThrow(NotFoundException);
      expect(productsRepository.delete).not.toHaveBeenCalled();
    });
  });
});