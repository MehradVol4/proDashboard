import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CabinsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.cabin.findMany({ orderBy: { name: 'asc' } });
  }

  async findOne(id: number) {
    const cabin = await this.prisma.cabin.findUnique({ where: { id } });
    if (!cabin) throw new NotFoundException('Cabin not found');
    return cabin;
  }

  create(data: any) {
    return this.prisma.cabin.create({ data });
  }

  async update(id: number, data: any) {
    await this.findOne(id);
    return this.prisma.cabin.update({ where: { id }, data });
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.prisma.cabin.delete({ where: { id } });
    return { id };
  }
}
