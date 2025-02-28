import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class DeleteProductsDto {
  @ApiProperty({
    description: "Id of the product",
    example: "sjjs8887djsahd73743278sdhsh",
  })
  @IsNotEmpty()
  @IsString()
  id: string;
}
