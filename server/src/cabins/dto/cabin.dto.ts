import { Type } from 'class-transformer';
import { IsInt, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateCabinDto {
  @IsString()
  name: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  maxCapacity: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  regularPrice: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  discount?: number;

  @IsOptional()
  @IsString()
  description?: string;

  // Present when the client re-sends an existing image URL instead of a file.
  @IsOptional()
  @IsString()
  image?: string;
}

export class UpdateCabinDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  maxCapacity?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  regularPrice?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  discount?: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  image?: string;
}
