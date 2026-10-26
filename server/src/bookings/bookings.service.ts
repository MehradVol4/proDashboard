import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { EventsService } from '../events/events.service';
import { buildOrderBy, buildPagination } from '../common/sorting';
import { QueryBookingsDto } from './dto/booking.dto';

const SORTABLE = ['startDate', 'endDate', 'totalPrice', 'created_at'];

// The list view only needs enough of the relation to render a row.
const LIST_INCLUDE = {
  cabins: { select: { name: true } },
  guests: { select: { fullName: true, email: true } },
};

function startOfDay(date = new Date()) {
  const copy = new Date(date);
  copy.setUTCHours(0, 0, 0, 0);
  return copy;
}

function endOfDay(date = new Date()) {
  const copy = new Date(date);
  copy.setUTCHours(23, 59, 59, 999);
  return copy;
}

@Injectable()
export class BookingsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly events: EventsService,
  ) {}

  async findPage({ status, sortBy, page }: QueryBookingsDto) {
    const where = status && status !== 'all' ? { status } : {};

    const [data, count] = await this.prisma.$transaction([
      this.prisma.booking.findMany({
        where,
        include: LIST_INCLUDE,
        orderBy: buildOrderBy(sortBy, SORTABLE, { startDate: 'desc' }),
        ...buildPagination(page),
      }),
      this.prisma.booking.count({ where }),
    ]);

    return { data, count };
  }

  async findOne(id: number) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: { cabins: true, guests: true },
    });

    if (!booking) throw new NotFoundException('Booking not found');
    return booking;
  }

  // Dashboard: everything booked since `date`, for the sales chart and stats.
  findCreatedAfter(date: string) {
    return this.prisma.booking.findMany({
      where: {
        created_at: { gte: new Date(date), lte: endOfDay() },
      },
      select: {
        created_at: true,
        totalPrice: true,
        extrasPrice: true,
        hasBreakfast: true,
        numNights: true,
        numGuests: true,
      },
    });
  }

  // Dashboard: stays that started since `date`, for occupancy and durations.
  findStaysAfter(date: string) {
    return this.prisma.booking.findMany({
      where: {
        startDate: { gte: new Date(date), lte: endOfDay() },
      },
      select: {
        id: true,
        status: true,
        numNights: true,
        startDate: true,
        endDate: true,
      },
    });
  }

  // Arrivals and departures for today.
  findTodayActivity() {
    const from = startOfDay();
    const to = endOfDay();

    return this.prisma.booking.findMany({
      where: {
        OR: [
          { status: 'unconfirmed', startDate: { gte: from, lte: to } },
          { status: 'checked-in', endDate: { gte: from, lte: to } },
        ],
      },
      include: {
        guests: {
          select: { fullName: true, nationality: true, countryFlag: true },
        },
      },
      orderBy: { created_at: 'asc' },
    });
  }

  // Everything still ahead for one cabin, so the booking form can refuse to
  // double-book it.
  findCabinRanges(cabinId: number) {
    return this.prisma.booking.findMany({
      where: { cabinId, endDate: { gte: startOfDay() } },
      select: { id: true, startDate: true, endDate: true, status: true },
      orderBy: { startDate: 'asc' },
    });
  }

  findByGuest(guestId: number) {
    return this.prisma.booking.findMany({
      where: { guestId },
      include: LIST_INCLUDE,
      orderBy: { startDate: 'desc' },
    });
  }

  async create(dto: any) {
    const booking = await this.prisma.booking.create({
      data: {
        ...dto,
        startDate: new Date(dto.startDate),
        endDate: new Date(dto.endDate),
      },
      include: LIST_INCLUDE,
    });

    this.events.emit({ type: 'booking.created', booking });
    return booking;
  }

  async update(id: number, dto: any) {
    const previous = await this.findOne(id);

    const booking = await this.prisma.booking.update({
      where: { id },
      data: dto,
      include: LIST_INCLUDE,
    });

    // Sending the previous row too means the activity feed can tell a real
    // status or payment change from an unrelated edit.
    this.events.emit({ type: 'booking.updated', booking, previous });
    return booking;
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.prisma.booking.delete({ where: { id } });

    this.events.emit({ type: 'booking.deleted', id });
    return { id };
  }
}
