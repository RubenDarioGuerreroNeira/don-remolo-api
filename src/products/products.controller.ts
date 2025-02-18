import { Controller, Get, Param } from "@nestjs/common";
import { ProductsService } from "./products.service";
import { Product } from "../entities/product.entity";

@Controller("products")
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  findAll(): Promise<Product[]> {
    return this.productsService.findAll();
  }

  @Get("category/:id")
  findByCategory(@Param("id") categoryId: string): Promise<Product[]> {
    return this.productsService.findByCategory(categoryId);
  }
}
