export interface ICategory {
  id?: string;
  name: string;
}

export interface IProduct {
  id?: string;
  name: string;
  price: number;
  categoryId: string;
}

export interface ICategoryProduct extends ICategory {
  products: IProduct[];
}
