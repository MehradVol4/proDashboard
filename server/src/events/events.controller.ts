import { Controller, Query, Sse, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { map, Observable } from 'rxjs';

import { EventsService } from './events.service';

type MessageEvent = { data: string };

@Controller('events')
export class EventsController {
  constructor(
    private readonly events: EventsService,
    private readonly jwt: JwtService,
  ) {}

  // EventSource cannot set an Authorization header, so the token comes through
  // the query string here. It is the same short-lived JWT used everywhere else.
  @Sse()
  stream(@Query('token') token?: string): Observable<MessageEvent> {
    if (!token) throw new UnauthorizedException('A token is required');

    try {
      this.jwt.verify(token);
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }

    return this.events
      .subscribe()
      .pipe(map((event) => ({ data: JSON.stringify(event) })));
  }
}
