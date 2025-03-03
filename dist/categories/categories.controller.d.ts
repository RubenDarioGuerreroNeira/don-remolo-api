import { CategoriesService } from "./categories.service";
import { CreateCategoryDto } from "../dto/create-category.dto";
import { HttpStatus } from "@nestjs/common";
export declare class CategoriesController {
    private readonly categoriesService;
    constructor(categoriesService: CategoriesService);
    create(createCategoryDto: CreateCategoryDto): Promise<{
        data: any;
        message: string;
        status: HttpStatus;
    }>;
    findAll(): Promise<{
        message: string;
        data: import("../entities/category.entity").Category[];
        status: number;
    } | {
        data: any;
        message: any;
        status: number;
    }>;
}
