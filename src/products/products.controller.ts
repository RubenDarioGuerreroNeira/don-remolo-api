import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { ProductsService } from "./products.service";
import { Product } from "../entities/product.entity";
import { CreateProductsDto } from "../dto/create-products.dto";

@Controller("products")
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  async create(@Body() createProductsDto: CreateProductsDto): Promise<any> {
    return this.productsService.create(createProductsDto);
  }

  @Get()
  findAll(): Promise<Product[]> {
    return this.productsService.findAll();
  }

  @Get("category/:id")
  findByCategory(@Param("id") categoryId: string): Promise<Product[]> {
    return this.productsService.findByCategory(categoryId);
  }
}
