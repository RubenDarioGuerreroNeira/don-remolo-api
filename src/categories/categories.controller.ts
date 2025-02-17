import { Controller } from "@nestjs/common";
import { CategoriesService } from "./categories.service";
import { CreateCategoryDto } from "../dto/create-category.dto";
import { HttpStatus, HttpException } from "@nestjs/common";

@Controller("categories")
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}
}
