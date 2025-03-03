export interface Rproduct {
    status: number;
    data: any;
    message: string;
}
export interface Rproducts {
    status: number;
    data: Rproduct[];
    message: string;
}
