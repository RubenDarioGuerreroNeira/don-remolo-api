import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Delete,
  Query,
} from "@nestjs/common";
import { CategoriesService } from "./categories.service";
import { CreateCategoryDto } from "../dto/create-category.dto";
import { HttpStatus, HttpException } from "@nestjs/common";
import { ICategory, RespCategory } from "../interfaces/interface-categories";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";

@ApiTags("categories")
@Controller("categories")
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}
  @ApiOperation({ summary: "Get all categories" })
  @ApiResponse({ status: 201, description: "Product Created" })
  @ApiResponse({ status: 400, description: "Bad Request" })
  @Post()
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    const { data, message, status } = await this.categoriesService.create(
      createCategoryDto
    );
    if (status === HttpStatus.CREATED) {
      return { data, message, status };
    } else {
      throw new HttpException(message, status);
    }
  }

  @ApiOperation({ summary: "Get a categoies" })
  @ApiResponse({ status: 200, description: "Categories Found" })
  @ApiResponse({ status: 400, description: "Bad Request" })
  @Get()
  async findAll() {
    try {
      const data = await this.categoriesService.findAll();
      return { message: "Categories found", data, status: 200 };
    } catch (err) {
      return { data: null, message: err.message, status: 400 };
    }
  }
} // fin
