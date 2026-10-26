import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { buildOrderBy, buildPagination } from '../common/sorting';
import { QueryGuestsDto } from './dto/guest.dto';

const SORTABLE = ['fullName', 'created_at', 'nationality', 'email'];

@Injectable()
export class GuestsService {
  constructor(private readonly prisma: PrismaService) {}

  // Unpaginated, for the booking form's picker and the activity feed's lookups.
  findAll() {
    return this.prisma.guest.findMany({ orderBy: { fullName: 'asc' } });
  }

  async findPage({ search, sortBy, page }: QueryGuestsDto) {
    const term = (search ?? '').trim();

    const where = term
      ? {
          OR: [
            { fullName: { contains: term } },
            { email: { contains: term } },
            { nationality: { contains: term } },
            { nationalID: { contains: term } },
          ],
        }
      : {};

    const [data, count] = await this.prisma.$transaction([
      this.prisma.guest.findMany({
        where,
        orderBy: buildOrderBy(sortBy, SORTABLE, { fullName: 'asc' }),
        ...buildPagination(page),
      }),
      this.prisma.guest.count({ where }),
    ]);

    return { data, count };
  }

  async findOne(id: number) {
    const guest = await this.prisma.guest.findUnique({ where: { id } });
    if (!guest) throw new NotFoundException('Guest not found');
    return guest;
  }

  create(data: any) {
    return this.prisma.guest.create({ data });
  }

  async update(id: number, data: any) {
    await this.findOne(id);
    return this.prisma.guest.update({ where: { id }, data });
  }

  async remove(id: number) {
    await this.findOne(id);

    // Deleting a guest with bookings would orphan them, so refuse with
    // something the UI can show rather than a raw constraint error.
    const bookings = await this.prisma.booking.count({ where: { guestId: id } });
    if (bookings > 0)
      throw new ConflictException(
        'This guest still has bookings. Delete those bookings first.',
      );

    await this.prisma.guest.delete({ where: { id } });
    return { id };
  }
}
