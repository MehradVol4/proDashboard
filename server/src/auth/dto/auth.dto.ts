import {
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class SignupDto {
  @IsString()
  @MinLength(1, { message: 'A full name is required' })
  fullName: string;

  @IsEmail({}, { message: 'Please provide a valid email' })
  email: string;

  @IsString()
  @MinLength(8, { message: 'Password must at least have 8 characters!' })
  password: string;
}

export class LoginDto {
  @IsEmail({}, { message: 'Please provide a valid email' })
  email: string;

  @IsString()
  @MinLength(1, { message: 'A password is required' })
  password: string;
}

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  fullName?: string;

  @IsOptional()
  @IsString()
  @MinLength(8, { message: 'Password must at least have 8 characters!' })
  password?: string;
}

export class ForgotPasswordDto {
  @IsEmail({}, { message: 'Please provide a valid email' })
  email: string;
}

export class ResetPasswordDto {
  @IsString()
  token: string;

  @IsString()
  @MinLength(8, { message: 'Password must at least have 8 characters!' })
  password: string;
}
