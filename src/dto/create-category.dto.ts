import { IsString, IsArray, IsNotEmpty } from "class-validator";
import { OrderItem } from "../interfaces/order-item.interfaces";

export class CreateCategoryDto {
  name: string;

  description: string;
}
