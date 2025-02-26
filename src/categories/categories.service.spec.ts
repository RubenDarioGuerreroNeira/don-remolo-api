import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CategoriesService } from "./categories.service";
import { Category } from "../entities/category.entity";
import { CreateCategoryDto } from "../dto/create-category.dto";

describe("CategoriesService", () => {
  let service: CategoriesService;
  let categoryRepository: Repository<Category>;

  const mockCategoryRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        {
          provide: getRepositoryToken(Category),
          useValue: mockCategoryRepository,
        },
      ],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
    categoryRepository = module.get<Repository<Category>>(
      getRepositoryToken(Category)
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("validateCategories", () => {
    it("should throw error if name is empty", async () => {
      const categoryDto = { name: "" };
      await expect(service.validateCategories(categoryDto)).rejects.toThrow(
        "Category name is required"
      );
    });

    it("should throw error if category exists", async () => {
      const categoryDto = { name: "Existing" };
      mockCategoryRepository.findOne.mockResolvedValue({
        id: "1",
        name: "Existing",
      });

      await expect(service.validateCategories(categoryDto)).rejects.toThrow(
        "Category already exists"
      );
    });

    it("should pass validation for valid new category", async () => {
      const categoryDto = { name: "New Category" };
      mockCategoryRepository.findOne.mockResolvedValue(null);

      await expect(
        service.validateCategories(categoryDto)
      ).resolves.not.toThrow();
    });
  });

  describe("create", () => {
    it("should create a category successfully", async () => {
      const createCategoryDto: CreateCategoryDto = {
        name: "Pizza",
      };

      const savedCategory = {
        id: "1",
        name: "Pizza",
      };

      mockCategoryRepository.findOne.mockResolvedValue(null);
      mockCategoryRepository.save.mockResolvedValue(savedCategory);

      const result = await service.create(createCategoryDto);

      expect(result).toEqual({
        data: savedCategory,
        message: "Category created successfully",
        status: 200,
      });
      expect(mockCategoryRepository.findOne).toHaveBeenCalledWith({
        where: { name: createCategoryDto.name },
      });
      expect(mockCategoryRepository.save).toHaveBeenCalledWith(
        createCategoryDto
      );
    });

    it("should return error if category already exists", async () => {
      const createCategoryDto: CreateCategoryDto = {
        name: "Pizza",
      };

      mockCategoryRepository.findOne.mockResolvedValue({
        id: "1",
        name: "Pizza",
      });

      const result = await service.create(createCategoryDto);

      expect(result).toEqual({
        data: null,
        message: "Category already exists",
        status: 400,
      });
    });

    it("should return error if name is empty", async () => {
      const createCategoryDto: CreateCategoryDto = {
        name: "",
      };

      const result = await service.create(createCategoryDto);

      expect(result).toEqual({
        data: null,
        message: "Category name is required",
        status: 400,
      });
    });
  });

  describe("findAll", () => {
    it("should return all categories", async () => {
      const expectedCategories = [
        { id: "1", name: "Pizza" },
        { id: "2", name: "Bebidas" },
      ];

      mockCategoryRepository.find.mockResolvedValue(expectedCategories);

      const result = await service.findAll();

      expect(result).toEqual(expectedCategories);
      expect(mockCategoryRepository.find).toHaveBeenCalled();
    });
  });

  describe("findByProduct", () => {
    it("should return categories by product id", async () => {
      const productId = "123";
      const expectedCategories = [
        { id: "1", name: "Pizza", products: [{ id: productId }] },
      ];

      mockCategoryRepository.find.mockResolvedValue(expectedCategories);

      const result = await service.findByProduct(productId);

      expect(result).toEqual(expectedCategories);
      expect(mockCategoryRepository.find).toHaveBeenCalledWith({
        relations: ["products"],
        where: { products: { id: productId } },
      });
    });

    it("should return empty array if no categories found", async () => {
      const productId = "999";
      mockCategoryRepository.find.mockResolvedValue([]);

      const result = await service.findByProduct(productId);

      expect(result).toEqual([]);
    });
  });
});

// import { Test, TestingModule } from "@nestjs/testing";
// import { getRepositoryToken } from "@nestjs/typeorm";
// import { Repository } from "typeorm";
// import { CategoriesService } from "./categories.service";
// import { Category } from "../entities/category.entity";
// import { CreateCategoryDto } from "../dto/create-category.dto";

// describe("CategoriesService", () => {
//   let service: CategoriesService;
//   let categoryRepository: Repository<Category>;

//   const mockCategoryRepository = {
//     create: jest.fn(),
//     save: jest.fn(),
//     find: jest.fn(),
//     findOne: jest.fn(),
//   };

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [
//         CategoriesService,
//         {
//           provide: getRepositoryToken(Category),
//           useValue: mockCategoryRepository,
//         },
//       ],
//     }).compile();

//     service = module.get<CategoriesService>(CategoriesService);
//     categoryRepository = module.get<Repository<Category>>(
//       getRepositoryToken(Category)
//     );
//   });

//   afterEach(() => {
//     jest.clearAllMocks();
//   });

//   describe("create", () => {
//     it("should create a category successfully", async () => {
//       // Arrange
//       const createCategoryDto: CreateCategoryDto = {
//         name: "Pizza",
//       };

//       const savedCategory = {
//         id: "1",
//         name: "Pizza",
//       };

//       mockCategoryRepository.findOne.mockResolvedValue(null);
//       mockCategoryRepository.save.mockResolvedValue(savedCategory);

//       // Act
//       const result = await service.create(createCategoryDto);

//       // Assert
//       expect(result).toEqual({
//         data: savedCategory,
//         message: "Category created successfully",
//         status: 200,
//       });
//       expect(mockCategoryRepository.findOne).toHaveBeenCalledWith({
//         where: { name: createCategoryDto.name },
//       });
//       expect(mockCategoryRepository.save).toHaveBeenCalledWith(
//         createCategoryDto
//       );
//     });

//     it("should return error if category already exists", async () => {
//       // Arrange
//       const createCategoryDto: CreateCategoryDto = {
//         name: "Pizza",
//       };

//       mockCategoryRepository.findOne.mockResolvedValue({
//         id: "1",
//         name: "Pizza",
//       });

//       // Act
//       const result = await service.create(createCategoryDto);

//       // Assert
//       expect(result).toEqual({
//         data: null,
//         message: "Category already exists",
//         status: 400,
//       });
//     });
//   });

//   describe("findAll", () => {
//     it("should return all categories", async () => {
//       // Arrange
//       const expectedCategories = [
//         { id: "1", name: "Pizza" },
//         { id: "2", name: "Bebidas" },
//       ];

//       mockCategoryRepository.find.mockResolvedValue(expectedCategories);

//       // Act
//       const result = await service.findAll();

//       // Assert
//       expect(result).toEqual(expectedCategories);
//       expect(mockCategoryRepository.find).toHaveBeenCalled();
//     });
//   });
// });

// // describe('findOne', () => {
// //   it('should return a category by id', async () => {
// //     // Arrange
// //     const categoryId = '1';
// //     const expectedCategory = { id: categoryId, name: 'Pizza' };

// //     mockCategoryRepository.findOne.mockResolvedValue(expectedCategory);

// // Act
// //       const result = await service.findOne(categoryId);

// //       // Assert
// //       expect(result).toEqual({
// //         data: expectedCategory,
// //         message: 'Category found successfully',
// //         status: 200,
// //       });
// //       expect(mockCategoryRepository.findOne).toHaveBeenCalledWith({
// //         where: { id: categoryId },
// //       });
// //     });

// //     it('should return null if category not found', async () => {
// //       // Arrange
// //       const categoryId = '999';
// //       mockCategoryRepository.findOne.mockResolvedValue(null);

// //       // Act
// //       const result = await service.findOne(categoryId);

// //       // Assert
// //       expect(result).toEqual({
// //         data: null,
// //         message: 'Category not found',
// //         status: 404,
// //       });
// //     });
// //   });
// // });

// // import { Test, TestingModule } from '@nestjs/testing';
// // import { getRepositoryToken } from '@nestjs/typeorm';
// // import { Repository } from 'typeorm';
// // import { CategoriesService } from './categories.service';
// // import { Category } from '../entities/category.entity';
// // import { CreateCategoryDto } from '../dto/create-category.dto';

// // describe('CategoriesService', () => {
// //   let service: CategoriesService;
// //   let repository: Repository<Category>;

// //   // Mock del repositorio
// //   const mockRepository = {
// //     findOne: jest.fn(),
// //     save: jest.fn(),
// //     find: jest.fn(),
// //   };

// //   beforeEach(async () => {
// //     const module: TestingModule = await Test.createTestingModule({
// //       providers: [
// //         CategoriesService,
// //         {
// //           provide: getRepositoryToken(Category),
// //           useValue: mockRepository,
// //         },
// //       ],
// //     }).compile();

// //     service = module.get<CategoriesService>(CategoriesService);
// //     repository = module.get<Repository<Category>>(getRepositoryToken(Category));
// //   });

// //   afterEach(() => {
// //     jest.clearAllMocks();
// //   });

// //   it('should be defined', () => {
// //     expect(service).toBeDefined();
// //   });

// //   describe('create', () => {
// //     it('should create a category successfully', async () => {
// //       // Arrange
// //       const createCategoryDto: CreateCategoryDto = { name: 'Pizza' };
// //       const savedCategory = { id: '1', ...createCategoryDto };

// //       mockRepository.findOne.mockResolvedValue(null);
// //       mockRepository.save.mockResolvedValue(savedCategory);

// //       // Act
// //       const result = await service.create(createCategoryDto);

// //       // Assert
// //       expect(result).toEqual({
// //         data: savedCategory,
// //         message: 'Category created successfully',
// //         status: 200,
// //       });
// //       expect(mockRepository.findOne).toHaveBeenCalledWith({
// //         where: { name: createCategoryDto.name },
// //       });
// //       expect(mockRepository.save).toHaveBeenCalledWith(createCategoryDto);
// //     });

// //     it('should fail if category already exists', async () => {
// //       // Arrange
// //       const createCategoryDto = { name: 'Pizza' };
// //       mockRepository.findOne.mockResolvedValue({ id: '1', name: 'Pizza' });

// //       // Act
// //       const result = await service.create(createCategoryDto);

// //       // Assert
// //       expect(result).toEqual({
// //         data: null,
// //         message: 'Category already exists',
// //         status: 400,
// //       });
// //       expect(mockRepository.save).not.toHaveBeenCalled();
// //     });

// //     it('should fail if name is not provided', async () => {
// //       // Arrange
// //       const createCategoryDto = { name: '' };

// //       // Act
// //       const result = await service.create(createCategoryDto);

// //       // Assert
// //       expect(result).toEqual({
// //         data: null,
// //         message: 'Category name is required',
// //         status: 400,
// //       });
// //       expect(mockRepository.findOne).not.toHaveBeenCalled();
// //       expect(mockRepository.save).not.toHaveBeenCalled();
// //     });
// //   });

// //   describe('findAll', () => {
// //     it('should return all categories', async () => {
// //       const expectedCategories = [
// //         { id: '1', name: 'Pizza' },
// //         { id: '2', name: 'Bebidas' },
// //       ];
// //       mockRepository.find.mockResolvedValue(expectedCategories);

// //       const result = await service.findAll();

// //       expect(result).toEqual(expectedCategories);
// //       expect(mockRepository.find).toHaveBeenCalled();
// //     });
// //   });

// //   describe('findByProduct', () => {
// //     it('should return categories by product id', async () => {
// //       const productId = '123';
// //       const expectedCategories = [
// //         { id: '1', name: 'Pizza' },
// //       ];
// //       mockRepository.find.mockResolvedValue(expectedCategories);

// //       const result = await service.findByProduct(productId);

// //       expect(result).toEqual(expectedCategories);
// //       expect(mockRepository.find).toHaveBeenCalledWith({
// //         relations: ['products'],
// //         where: { products: { id: productId } },
// //       });
// //     });
// //   });
// // });

// // // import { Test, TestingModule } from "@nestjs/testing";
// // // import { getRepositoryToken } from "@nestjs/typeorm";
// // import { Test, TestingModule } from "@nestjs/testing";
// // import { getRepositoryToken } from "@nestjs/typeorm";
// // import { Repository } from "typeorm";
// // import { CategoriesService } from "./categories.service";
// // import { Category } from "../entities/category.entity";

// // describe("CategoriesService", () => {
// //   let service: CategoriesService;
// //   let repository: Repository<Category>;

// //   // Mock del repositorio
// //   const mockRepository = {
// //     findOne: jest.fn(),
// //     save: jest.fn(),
// //     find: jest.fn(),
// //   };

// //   beforeEach(async () => {
// //     const module: TestingModule = await Test.createTestingModule({
// //       providers: [
// //         CategoriesService,
// //         {
// //           provide: getRepositoryToken(Category),
// //           useValue: mockRepository,
// //         },
// //       ],
// //     }).compile();

// //     service = module.get<CategoriesService>(CategoriesService);
// //     repository = module.get<Repository<Category>>(getRepositoryToken(Category));
// //   });

// //   // Limpia los mocks después de cada prueba
// //   afterEach(() => {
// //     jest.clearAllMocks();
// //   });

// //   // Prueba básica de existencia del servicio
// //   it("should be defined", () => {
// //     expect(service).toBeDefined();
// //   });

// //   // Pruebas para el método create
// //   describe("create", () => {
// //     it("should create a category successfully", async () => {
// //       const createCategoryDto = { name: "Pizza" };
// //       mockRepository.findOne.mockResolvedValue(null);
// //       mockRepository.save.mockResolvedValue(createCategoryDto);

// //       const result = await service.create(createCategoryDto);

// //       expect(result).toEqual({
// //         data: createCategoryDto,
// //         message: "Category created successfully",
// //         status: 200,
// //       });
// //       expect(mockRepository.findOne).toHaveBeenCalledWith({
// //         where: { name: "Pizza" },
// //       });
// //     });

// //     it("should fail if category already exists", async () => {
// //       const createCategoryDto = { name: "Pizza" };
// //       mockRepository.findOne.mockResolvedValue({ id: "1", name: "Pizza" });

// //       const result = await service.create(createCategoryDto);

// //       expect(result).toEqual({
// //         data: null,
// //         message: "Category already exists",
// //         status: 400,
// //       });
// //     });

// //     it("should fail if name is not provided", async () => {
// //       const createCategoryDto = { name: "" };

// //       const result = await service.create(createCategoryDto);

// //       expect(result).toEqual({
// //         data: null,
// //         message: "Category name is required",
// //         status: 400,
// //       });
// //     });
// //   });

// //   // Pruebas para el método findAll
// //   describe("findAll", () => {
// //     it("should return all categories", async () => {
// //       const expectedCategories = [
// //         { id: "1", name: "Pizza" },
// //         { id: "2", name: "Bebidas" },
// //       ];
// //       mockRepository.find.mockResolvedValue(expectedCategories);

// //       const result = await service.findAll();

// //       expect(result).toEqual(expectedCategories);
// //       expect(mockRepository.find).toHaveBeenCalled();
// //     });
// //   });

// //   // Pruebas para el método findByProduct
// //   describe("findByProduct", () => {
// //     it("should return categories by product id", async () => {
// //       const productId = "123";
// //       const expectedCategories = [{ id: "1", name: "Pizza" }];
// //       mockRepository.find.mockResolvedValue(expectedCategories);

// //       const result = await service.findByProduct(productId);

// //       expect(result).toEqual(expectedCategories);
// //       expect(mockRepository.find).toHaveBeenCalledWith({
// //         relations: ["products"],
// //         where: { products: { id: productId } },
// //       });
// //     });
// //   });
// // });

// // import { Repository } from "typeorm";
// // import { CategoriesService } from "./categories.service";
// // import { Category } from "../entities/category.entity";

// // describe("CategoriesService", () => {
// //   let service: CategoriesService;
// //   let repository: Repository<Category>;

// //   const mockRepository = {
// //     findOne: jest.fn(),
// //     save: jest.fn(),
// //     find: jest.fn(),
// //   };

// //   beforeEach(async () => {
// //     const module: TestingModule = await Test.createTestingModule({
// //       providers: [
// //         CategoriesService,
// //         {
// //           provide: getRepositoryToken(Category),
// //           useValue: mockRepository,
// //         },
// //       ],
// //     }).compile();

// //     service = module.get<CategoriesService>(CategoriesService);
// //     repository = module.get<Repository<Category>>(getRepositoryToken(Category));
// //   });

// //   it("should be defined", () => {
// //     expect(service).toBeDefined();
// //   });

// //   describe("create", () => {
// //     it("should create a category successfully", async () => {
// //       const createCategoryDto = {
// //         name: "Test Category",
// //       };

// //       mockRepository.findOne.mockResolvedValue(null);
// //       mockRepository.save.mockResolvedValue(createCategoryDto);

// //       const result = await service.create(createCategoryDto);

// //       expect(result.status).toBe(200);
// //       expect(result.message).toBe("Category created successfully");
// //       expect(result.data).toBeDefined();
// //     });

// //     it("should fail if category already exists", async () => {
// //       const createCategoryDto = {
// //         name: "Existing Category",
// //       };

// //       mockRepository.findOne.mockResolvedValue({
// //         id: "1",
// //         name: "Existing Category",
// //       });

// //       const result = await service.create(createCategoryDto);

// //       expect(result.status).toBe(400);
// //       expect(result.message).toBe("Category already exists");
// //       expect(result.data).toBeNull();
// //     });
// //   });
// // });
