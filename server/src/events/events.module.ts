import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { EventsService } from './events.service';
import { EventsController } from './events.controller';

@Global()
@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET,
        // Typed loosely because the value is a duration string from the
        // environment, which @types/jsonwebtoken models as a literal union.
        signOptions: {
          expiresIn: (process.env.JWT_EXPIRES_IN || '7d') as any,
        },
      }),
    }),
  ],
  controllers: [EventsController],
  providers: [EventsService],
  exports: [EventsService, JwtModule],
})
export class EventsModule {}
