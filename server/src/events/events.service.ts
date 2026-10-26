import { Injectable } from '@nestjs/common';
import { Observable, Subject } from 'rxjs';

export type AppEvent = {
  type: 'booking.created' | 'booking.updated' | 'booking.deleted';
  booking?: any;
  previous?: any;
  id?: number;
};

@Injectable()
export class EventsService {
  // In-memory fan-out. Everything connected right now hears about it; nothing
  // is replayed to a client that connects later, which is all the activity feed
  // needs since it keeps its own history.
  private readonly stream = new Subject<AppEvent>();

  emit(event: AppEvent) {
    this.stream.next(event);
  }

  subscribe(): Observable<AppEvent> {
    return this.stream.asObservable();
  }
}
