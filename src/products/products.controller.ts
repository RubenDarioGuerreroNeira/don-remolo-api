import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { ProductsService } from "./products.service";
import { Product } from "../entities/product.entity";
import { UpdateProductsDto } from "../dto/update-products";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
  ApiParam,
} from "@nestjs/swagger";

import { CreateProductsDto } from "../dto/create-products.dto";
import { PaginationDto } from "../dto/pagination.dto";

@ApiTags("products")
@Controller("products")
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @ApiOperation({ summary: "Create a product" })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "Product Created",
    type: Product,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Bad Request" })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: "Product already exists",
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Category not found",
  })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createProductsDto: CreateProductsDto): Promise<Product> {
    return this.productsService.create(createProductsDto);
  }

  @ApiOperation({ summary: "Get all products" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Products Found",
    schema: {
      properties: {
        items: {
          type: "array",
          items: { type: "object", properties: {} },
        },
        total: { type: "number" },
        page: { type: "number" },
        limit: { type: "number" },
      },
    },
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Bad Request" })
  @ApiQuery({ name: "page", required: false, type: Number })
  @ApiQuery({ name: "limit", required: false, type: Number })
  @Get()
  findAll(@Query() paginationDto: PaginationDto): Promise<{
    items: Product[];
    total: number;
    page: number;
    limit: number;
  }> {
    return this.productsService.findAll(paginationDto);
  }

  @ApiOperation({ summary: "Get a product by ID" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Product Found",
    type: Product,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Product not found",
  })
  @ApiParam({ name: "id", description: "Product ID" })
  @Get(":id")
  findOne(@Param("id") id: string): Promise<Product> {
    return this.productsService.findOne(id);
  }

  @ApiOperation({ summary: "Get products by category" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Products Found",
    schema: {
      properties: {
        items: {
          type: "array",
          items: { type: "object", properties: {} },
        },
        total: { type: "number" },
        page: { type: "number" },
        limit: { type: "number" },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Category not found",
  })
  @ApiParam({ name: "id", description: "Category ID" })
  @ApiQuery({ name: "page", required: false, type: Number })
  @ApiQuery({ name: "limit", required: false, type: Number })
  @Get("category/:id")
  findByCategory(
    @Param("id") categoryId: string,
    @Query() paginationDto: PaginationDto
  ): Promise<{
    items: Product[];
    total: number;
    page: number;
    limit: number;
  }> {
    return this.productsService.findByCategory(categoryId, paginationDto);
  }

  @ApiOperation({ summary: "Update a product" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Product Updated",
    type: Product,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Bad Request" })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Product or Category not found",
  })
  @ApiParam({ name: "id", description: "Product ID" })
  @Patch(":id")
  async update(
    @Param("id") id: string,
    @Body() updateProductsDto: UpdateProductsDto
  ): Promise<Product> {
    return this.productsService.update(id, updateProductsDto);
  }

  @ApiOperation({ summary: "Delete a product" })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: "Product Deleted",
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Product not found",
  })
  @ApiParam({ name: "id", description: "Product ID" })
  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param("id") id: string): Promise<void> {
    return this.productsService.remove(id);
  }
}
