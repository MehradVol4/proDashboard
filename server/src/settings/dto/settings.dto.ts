import { Type } from 'class-transformer';
import { IsInt, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class UpdateSettingsDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  minBookingLength?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  maxBookingLength?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  maxGuestPerBooking?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  breakfastPrice?: number;

  @IsOptional()
  @IsString()
  hotelName?: string;

  @IsOptional()
  @IsString()
  hotelLogoUrl?: string;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsOptional()
  @IsString()
  locale?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(100)
  taxRate?: number;

  @IsOptional()
  @IsString()
  checkInTime?: string;

  @IsOptional()
  @IsString()
  checkOutTime?: string;

  @IsOptional()
  @IsString()
  cancellationPolicy?: string;
}
