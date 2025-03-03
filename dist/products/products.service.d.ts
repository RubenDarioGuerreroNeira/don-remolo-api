import { Repository } from "typeorm";
import { Product } from "../entities/product.entity";
import { Category } from "../entities/category.entity";
import { CreateProductsDto } from "../dto/create-products.dto";
import { UpdateProductsDto } from "../dto/update-products";
import { PaginationDto } from "../dto/pagination.dto";
export declare class ProductsService {
    private productsRepository;
    private categoriesRepository;
    constructor(productsRepository: Repository<Product>, categoriesRepository: Repository<Category>);
    create(createProductsDto: CreateProductsDto): Promise<Product>;
    findAll(paginationDto?: PaginationDto): Promise<{
        items: Product[];
        total: number;
        page: number;
        limit: number;
    }>;
    findOne(id: string): Promise<Product>;
    findByCategory(categoryId: string, paginationDto?: PaginationDto): Promise<{
        items: Product[];
        total: number;
        page: number;
        limit: number;
    }>;
    update(id: string, updateProductsDto: UpdateProductsDto): Promise<Product>;
    remove(id: string): Promise<void>;
}
