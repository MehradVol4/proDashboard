import { randomBytes } from 'crypto';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

import { PrismaService } from '../prisma/prisma.service';
import {
  ForgotPasswordDto,
  LoginDto,
  ResetPasswordDto,
  SignupDto,
  UpdateUserDto,
} from './dto/auth.dto';

const SALT_ROUNDS = 10;
const RESET_TOKEN_TTL_MS = 60 * 60 * 1000;

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  // The client was written against Supabase's user object, so keep that shape
  // rather than rewriting every component that reads `user_metadata`.
  serialize(user: any) {
    if (!user) return null;

    return {
      id: user.id,
      email: user.email,
      role: 'authenticated',
      created_at: user.created_at,
      user_metadata: {
        fullName: user.fullName,
        avatar: user.avatar ?? '',
      },
    };
  }

  private sign(user: { id: number; email: string }) {
    return this.jwt.sign({ sub: user.id, email: user.email });
  }

  async signup({ fullName, email, password }: SignupDto) {
    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing)
      throw new ConflictException('An account with that email already exists');

    const user = await this.prisma.user.create({
      data: {
        fullName,
        email,
        password: await bcrypt.hash(password, SALT_ROUNDS),
      },
    });

    return { user: this.serialize(user), session: { token: this.sign(user) } };
  }

  async login({ email, password }: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email } });

    // Same message either way, so this cannot be used to discover which
    // addresses have accounts.
    const invalid = new UnauthorizedException('Invalid login credentials');
    if (!user) throw invalid;

    const matches = await bcrypt.compare(password, user.password);
    if (!matches) throw invalid;

    return { user: this.serialize(user), session: { token: this.sign(user) } };
  }

  async updateUser(userId: number, dto: UpdateUserDto, avatarUrl?: string) {
    const data: Record<string, unknown> = {};

    if (dto.fullName) data.fullName = dto.fullName;
    if (dto.password)
      data.password = await bcrypt.hash(dto.password, SALT_ROUNDS);
    if (avatarUrl) data.avatar = avatarUrl;

    if (!Object.keys(data).length)
      throw new BadRequestException('Nothing to update');

    const user = await this.prisma.user.update({
      where: { id: userId },
      data,
    });

    return { user: this.serialize(user) };
  }

  async forgotPassword({ email }: ForgotPasswordDto) {
    const user = await this.prisma.user.findUnique({ where: { email } });

    // Always answer the same way, so the response doesn't reveal who has an
    // account. The token only exists when the address does.
    if (user) {
      const token = randomBytes(32).toString('hex');
      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          resetToken: token,
          resetTokenExpiry: new Date(Date.now() + RESET_TOKEN_TTL_MS),
        },
      });

      // There is no mail provider wired up. Logging the link keeps the flow
      // usable in development; swap this for a real send before anyone else
      // uses the app.
      const origin = process.env.CLIENT_ORIGIN || 'http://localhost:5173';
      console.log(
        `[auth] password reset for ${email}: ${origin}/reset-password?token=${token}`,
      );
    }

    return { ok: true };
  }

  async resetPassword({ token, password }: ResetPasswordDto) {
    const user = await this.prisma.user.findFirst({
      where: { resetToken: token, resetTokenExpiry: { gt: new Date() } },
    });

    if (!user)
      throw new BadRequestException(
        'This reset link is no longer valid. Request a new one.',
      );

    const updated = await this.prisma.user.update({
      where: { id: user.id },
      data: {
        password: await bcrypt.hash(password, SALT_ROUNDS),
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    return {
      user: this.serialize(updated),
      session: { token: this.sign(updated) },
    };
  }

  async findById(id: number) {
    return this.prisma.user.findUnique({ where: { id } });
  }
}
