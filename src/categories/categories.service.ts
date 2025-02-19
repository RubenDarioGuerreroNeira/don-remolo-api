import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Category } from "../entities/category.entity";
import { Repository } from "typeorm";
import { CreateCategoryDto } from "../dto/create-category.dto";

interface resp {
  data: any;
  message: string;
  status: number;
}

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>
  ) {}

  public async validateCategories(category: CreateCategoryDto): Promise<any> {
    if (!category.name) {
      throw new Error("Category name is required");
    }

    const categories = await this.categoriesRepository.findOne({
      where: { name: category.name },
    });
    if (categories) {
      throw new Error("Category already exists");
    }
  }

  async create(createCategoryDto: CreateCategoryDto): Promise<resp> {
    try {
      await this.validateCategories(createCategoryDto);
      return {
        data: this.categoriesRepository.save(createCategoryDto),
        message: "Category created successfully",
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
  async findAll(): Promise<Category[]> {
    return this.categoriesRepository.find();
  }

  async findByProduct(productId: string): Promise<Category[]> {
    return this.categoriesRepository.find({
      relations: ["products"],
      where: { products: { id: productId } },
    });
  }
}
