export class CreateProductsDto {
  name: string;
  price: number;
  idCategory: string;
  description: string;
  stockIn: number;
  stockOut: number;
  categoryId: string;
}
