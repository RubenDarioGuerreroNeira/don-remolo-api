import { ProductsService } from "./products.service";
import { Product } from "../entities/product.entity";
import { UpdateProductsDto } from "../dto/update-products";
import { CreateProductsDto } from "../dto/create-products.dto";
import { PaginationDto } from "../dto/pagination.dto";
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    create(createProductsDto: CreateProductsDto): Promise<Product>;
    findAll(paginationDto: PaginationDto): Promise<{
        items: Product[];
        total: number;
        page: number;
        limit: number;
    }>;
    findOne(id: string): Promise<Product>;
    findByCategory(categoryId: string, paginationDto: PaginationDto): Promise<{
        items: Product[];
        total: number;
        page: number;
        limit: number;
    }>;
    update(id: string, updateProductsDto: UpdateProductsDto): Promise<Product>;
    remove(id: string): Promise<void>;
}
