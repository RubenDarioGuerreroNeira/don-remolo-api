import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
import { ProductsService } from "./products.service";
import { Product } from "../entities/product.entity";
import { UpdateProductsDto } from "../dto/update-products";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";

import { CreateProductsDto } from "../dto/create-products.dto";

@ApiTags("products")
@Controller("products")
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}
  @ApiOperation({ summary: "Create a product" })
  @ApiResponse({ status: 201, description: "Product Created" })
  @ApiResponse({ status: 400, description: "Bad Request" })
  @Post()
  async create(@Body() createProductsDto: CreateProductsDto): Promise<any> {
    return this.productsService.create(createProductsDto);
  }

  @ApiOperation({ summary: "Get all products" })
  @ApiResponse({ status: 200, description: "Products Found" })
  @ApiResponse({ status: 400, description: "Bad Request" })
  @Get()
  findAll(): Promise<Product[]> {
    return this.productsService.findAll();
  }

  @Get("category/:id")
  findByCategory(@Param("id") categoryId: string): Promise<Product[]> {
    return this.productsService.findByCategory(categoryId);
  }
  @Patch(":id")
  @ApiOperation({ summary: "Update a product" })
  @ApiResponse({ status: 200, description: "Product Updated" })
  @ApiResponse({ status: 400, description: "Bad Request" })
  async update(
    @Param("id") id: string,
    @Body() updateProductsDto: UpdateProductsDto
  ): Promise<any> {
    return this.productsService.update(id, updateProductsDto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete a product" })
  @ApiResponse({ status: 200, description: "Product Deleted" })
  @ApiResponse({ status: 400, description: "Bad Request" })
  async delete(@Param("id") id: string): Promise<any> {
    return this.productsService.delete(id);
  }
} // end class
