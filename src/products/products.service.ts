import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Product } from "../entities/product.entity";
import { Category } from "../entities/category.entity";
import { CreateProductsDto } from "../dto/create-products.dto";
import { UpdateProductsDto } from "../dto/update-products";
import { PaginationDto } from "../dto/pagination.dto"; // Asumiendo que crearás este DTO

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>
  ) {}

  async create(createProductsDto: CreateProductsDto): Promise<Product> {
    // Verificar si el producto ya existe
    const existingProduct = await this.productsRepository.findOne({
      where: { name: createProductsDto.name },
    });

    if (existingProduct) {
      throw new ConflictException("Product already exists");
    }

    // Validar stock
    if (createProductsDto.stockIn < 0) {
      throw new BadRequestException("StockIn must be greater than 0");
    }

    // Verificar si la categoría existe
    const category = await this.categoriesRepository.findOne({
      where: { id: createProductsDto.categoryId },
    });

    if (!category) {
      throw new NotFoundException(
        `Category with ID ${createProductsDto.categoryId} not found`
      );
    }

    // Crear y guardar el producto
    const product = this.productsRepository.create({
      ...createProductsDto,
      category: { id: createProductsDto.categoryId },
    });

    return this.productsRepository.save(product);
  }

  async findAll(paginationDto?: PaginationDto): Promise<{
    items: Product[];
    total: number;
    page: number;
    limit: number;
  }> {
    const { page = 1, limit = 10 } = paginationDto || {};

    const [items, total] = await this.productsRepository.findAndCount({
      relations: ["category"],
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      items,
      total,
      page,
      limit,
    };
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productsRepository.findOne({
      where: { id },
      relations: ["category"],
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  async findByCategory(
    categoryId: string,
    paginationDto?: PaginationDto
  ): Promise<{
    items: Product[];
    total: number;
    page: number;
    limit: number;
  }> {
    const { page = 1, limit = 10 } = paginationDto || {};

    // Verificar si la categoría existe
    const category = await this.categoriesRepository.findOne({
      where: { id: categoryId },
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${categoryId} not found`);
    }

    const [items, total] = await this.productsRepository.findAndCount({
      where: { category: { id: categoryId } },
      relations: ["category"],
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      items,
      total,
      page,
      limit,
    };
  }

  async update(
    id: string,
    updateProductsDto: UpdateProductsDto
  ): Promise<Product> {
    // Verificar si el producto existe
    const product = await this.productsRepository.findOne({
      where: { id },
      relations: ["category"],
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    // Verificar si la categoría existe si se proporciona categoryId
    if (updateProductsDto.categoryId) {
      const category = await this.categoriesRepository.findOne({
        where: { id: updateProductsDto.categoryId },
      });

      if (!category) {
        throw new NotFoundException(
          `Category with ID ${updateProductsDto.categoryId} not found`
        );
      }
    }

    // Crear un objeto solo con los campos que se proporcionan
    const productToUpdate = Object.entries(updateProductsDto)
      .filter(([key, value]) => value !== undefined && key !== "categoryId")
      .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {});

    // Actualizar el producto
    if (Object.keys(productToUpdate).length > 0) {
      await this.productsRepository.update(id, productToUpdate);
    }

    // Si se proporciona categoryId, actualizar la relación por separado
    if (updateProductsDto.categoryId) {
      await this.productsRepository.save({
        id,
        category: { id: updateProductsDto.categoryId } as Category,
      });
    }

    // Devolver el producto actualizado
    return this.productsRepository.findOne({
      where: { id },
      relations: ["category"],
    });
  }

  async remove(id: string): Promise<void> {
    const product = await this.productsRepository.findOne({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    await this.productsRepository.delete(id);
  }
}
