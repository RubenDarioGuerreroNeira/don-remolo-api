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

@Controller("categories")
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

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
