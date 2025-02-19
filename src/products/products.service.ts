import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Product } from "src/entities/product.entity";
import { Category } from "src/entities/category.entity";
import { Repository } from "typeorm";
import { CreateProductsDto } from "../dto/create-products.dto";
import { Rproducts, Rproduct } from "../interfaces/interfaces-products";

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>
  ) {}

  async validateProducts(datos: CreateProductsDto): Promise<any> {
    if (!datos.name) {
      throw new Error("Product name is required");
    }

    if (!datos.price || !datos.description || !datos.stockIn) {
      throw new Error("Product data is required");
    }
    if (datos.stockIn < 0) {
      throw new Error("StockIn must be greater than 0");
    }

    const product = await this.productsRepository.findOne({
      where: { name: datos.name },
    });
    if (product) {
      throw new Error("Product already exists");
    }
  }

  async validateCategory(categoryId: string): Promise<any> {
    const category = await this.categoriesRepository.findOne({
      where: { id: categoryId },
    });
    if (!category) {
      throw new Error("Category does not exist");
    }
  }

  async create(createProductsDto: CreateProductsDto): Promise<Rproduct> {
    try {
      await this.validateProducts(createProductsDto);
      await this.validateCategory(createProductsDto.categoryId);

      const savedProduct = await this.productsRepository.save({
        ...createProductsDto,
        category: { id: createProductsDto.categoryId },
      });
      return {
        data: savedProduct,
        message: "Product created successfully",
        status: 200,
      };
    } catch (err) {
      return {
        data: null,
        message: err.message,
        status: 400,
      };
    }
  }

  async findAll(): Promise<Product[]> {
    return this.productsRepository.find({ relations: ["category"] });
  }

  async findByCategory(categoryId: string): Promise<Product[]> {
    return this.productsRepository.find({
      where: { category: { id: categoryId } },
      relations: ["category"],
    });
  }
}
