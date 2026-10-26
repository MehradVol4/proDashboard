import { Type } from 'class-transformer';
import { IsEmail, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreateGuestDto {
  @IsString()
  fullName: string;

  @IsEmail({}, { message: 'Please provide a valid email' })
  email: string;

  @IsOptional()
  @IsString()
  nationality?: string;

  @IsOptional()
  @IsString()
  nationalID?: string;

  @IsOptional()
  @IsString()
  countryFlag?: string;
}

export class UpdateGuestDto {
  @IsOptional()
  @IsString()
  fullName?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Please provide a valid email' })
  email?: string;

  @IsOptional()
  @IsString()
  nationality?: string;

  @IsOptional()
  @IsString()
  nationalID?: string;

  @IsOptional()
  @IsString()
  countryFlag?: string;
}

export class QueryGuestsDto {
  @IsOptional()
  @IsString()
  search?: string;

  // "<field>-<asc|desc>", e.g. fullName-asc
  @IsOptional()
  @IsString()
  sortBy?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;
}
