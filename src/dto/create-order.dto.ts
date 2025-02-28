import { IsString, IsArray, IsNotEmpty } from "class-validator";
import { OrderItem } from "../interfaces/order-item.interfaces";
import { Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
export class CreateOrderDto {
  @ApiProperty({
    description: "Items of the order",
    example: [
      { productId: "aswer44ddñpdochh9", quantity: 1 },
      { productId: "jauueetcnzkoeyfg1525", quantity: 2 },
    ],
    required: true,
  })
  @IsArray()
  @IsNotEmpty()
  items: OrderItem[];

  @ApiProperty({
    description: "Total of the order",
    example: 10,
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @Type(() => Number)
  total: number;

  @ApiProperty({
    description: "Customer name",
    example: "Juan Perez",
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @Type(() => String)
  customerName: string;

  @ApiProperty({
    description: "Customer phone",
    example: "123456789",
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @Type(() => String)
  customerPhone: string;
  @ApiProperty({
    description: "Customer address",
    example: "Calle 123",
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @Type(() => String)
  customerAddress: string;
}
