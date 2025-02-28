import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";

export class CreateProductsDto {
  @ApiProperty({
    description: "Name of the product",
    example: "Pizza",
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @Type(() => String)
  name: string;

  @ApiProperty({
    description: "Price of the product",
    example: 10,
    required: true,
    minimum: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  price: number;

  @ApiProperty({
    description: "Description of the product",
    example: "Musrooms,Pepper,Onions",
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @Type(() => String)
  description: string;

  @ApiProperty({
    description: "Stock of the product",
    example: 10,
    required: true,
  })
  @ApiProperty({
    description: "Stock of the product",
    example: 10,
    required: true,
  })
  stockIn: number;

  @ApiProperty({
    description: "Id Category ",
    example: "sjjs8887djsahd73743278sdhsh",
    required: true,
  })
  @IsNumber()
  @Type(() => String)
  categoryId: string;
  // idCategory: string;

  stockOut: number;
  
}
