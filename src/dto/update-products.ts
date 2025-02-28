import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateProductsDto {
  @ApiProperty({
    description: "Name of the product",
    example: "Pizza",
  })
  @IsOptional()
  @IsString()
  name: string;

  @ApiProperty({
    description: "Price of the product",
    example: 100,
  })
  @IsOptional()
  @IsNumber()
  price: number;

  @ApiProperty({
    description: "Description of the product",
    example: "Musrooms,Pepper,Onions",
  })
  @IsOptional()
  @IsString()
  description: string;

  @ApiProperty({
    description: "Id Category",
    example: "sjjs8887djsahd73743278sdhsh",
  })
  @IsNotEmpty()
  @IsString()
  categoryId: string;
}
