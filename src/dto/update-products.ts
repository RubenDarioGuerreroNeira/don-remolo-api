import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateProductsDto {
  @ApiProperty({
    description: "Name of the product",
    example: "Pizza",
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: "Price of the product",
    example: 100,
  })
  @IsNotEmpty()
  @IsNumber()
  price: number;

  @ApiProperty({
    description: "Description of the product",
    example: "Musrooms,Pepper,Onions",
  })
  @IsNotEmpty()
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
