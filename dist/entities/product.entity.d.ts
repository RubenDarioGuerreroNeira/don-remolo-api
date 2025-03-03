import { Category } from "./category.entity";
export declare class Product {
    id: string;
    name: string;
    price: number;
    description: string;
    stockIn: number;
    stockOut: number;
    category: Category;
}
