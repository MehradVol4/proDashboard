import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export const BOOKING_STATUSES = [
  'unconfirmed',
  'checked-in',
  'checked-out',
] as const;

export class CreateBookingDto {
  @Type(() => Number)
  @IsInt()
  cabinId: number;

  @Type(() => Number)
  @IsInt()
  guestId: number;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  numNights: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  numGuests: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  cabinPrice?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  extrasPrice?: number;

  @Type(() => Number)
  @IsNumber()
  totalPrice: number;

  @IsOptional()
  @IsIn(BOOKING_STATUSES as unknown as string[])
  status?: string;

  @IsOptional()
  @IsBoolean()
  hasBreakfast?: boolean;

  @IsOptional()
  @IsBoolean()
  isPaid?: boolean;

  @IsOptional()
  @IsString()
  observations?: string;
}

export class UpdateBookingDto {
  @IsOptional()
  @IsIn(BOOKING_STATUSES as unknown as string[])
  status?: string;

  @IsOptional()
  @IsBoolean()
  hasBreakfast?: boolean;

  @IsOptional()
  @IsBoolean()
  isPaid?: boolean;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  extrasPrice?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  totalPrice?: number;

  @IsOptional()
  @IsString()
  observations?: string;
}

export class QueryBookingsDto {
  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  sortBy?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;
}
