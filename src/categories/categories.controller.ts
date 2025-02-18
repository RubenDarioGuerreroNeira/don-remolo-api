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
import { ICategory } from "../interfaces/interface-categories";

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
}
