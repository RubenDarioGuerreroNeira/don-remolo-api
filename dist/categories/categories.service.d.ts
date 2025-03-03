import { Category } from "../entities/category.entity";
import { Repository } from "typeorm";
import { CreateCategoryDto } from "../dto/create-category.dto";
interface resp {
    data: any;
    message: string;
    status: number;
}
export declare class CategoriesService {
    private categoriesRepository;
    constructor(categoriesRepository: Repository<Category>);
    validateCategories(category: CreateCategoryDto): Promise<any>;
    create(createCategoryDto: CreateCategoryDto): Promise<resp>;
    findAll(): Promise<Category[]>;
    findByProduct(productId: string): Promise<Category[]>;
}
export {};
