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

  async create(createCategoryDto: CreateCategoryDto): Promise<resp> {
    return {
      data: this.categoriesRepository.save(createCategoryDto),
      message: "Category created successfully",
      status: 200,
    };
  }

  async findAll(): Promise<Category[]> {
    return this.categoriesRepository.find();
  }

  async findByProduct(productId: number): Promise<Category[]> {
    return this.categoriesRepository.find({
      relations: ["products"],
      where: { products: { id: productId } },
    });
  }
}
