import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { AuthService } from './auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly auth: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  // Load the user on every request rather than trusting the token's claims, so
  // a deleted account stops working immediately.
  async validate(payload: { sub: number }) {
    const user = await this.auth.findById(payload.sub);
    if (!user) throw new UnauthorizedException('This account no longer exists');
    return user;
  }
}
