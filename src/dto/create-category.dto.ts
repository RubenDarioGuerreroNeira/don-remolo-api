import { IsString, IsArray, IsNotEmpty } from "class-validator";
import { OrderItem } from "../interfaces/order-item.interfaces";
import { Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

export class CreateCategoryDto {
  @ApiProperty({
    description: "Name of the category",
    example: "Pizza Napoli",
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @Type(() => String)
  name: string;
}
