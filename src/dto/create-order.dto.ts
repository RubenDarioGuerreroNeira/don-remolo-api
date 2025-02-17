import { IsString, IsArray, IsNotEmpty } from "class-validator";
import { OrderItem } from "../interfaces/order-item.interfaces";

export class CreateOrderDto {
  @IsArray()
  @IsNotEmpty()
  items: OrderItem[];

  @IsString()
  @IsNotEmpty()
  customerName: string;

  @IsString()
  @IsNotEmpty()
  customerPhone: string;

  @IsString()
  @IsNotEmpty()
  customerAddress: string;
}
