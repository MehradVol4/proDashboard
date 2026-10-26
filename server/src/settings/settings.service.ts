import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SettingsService {
  constructor(private readonly prisma: PrismaService) {}

  // There is exactly one settings row, id 1. Create it on first read so a
  // fresh database doesn't 404 the whole app shell.
  async find() {
    const existing = await this.prisma.settings.findUnique({ where: { id: 1 } });
    if (existing) return existing;

    return this.prisma.settings.create({ data: { id: 1 } });
  }

  async update(data: any) {
    await this.find();
    return this.prisma.settings.update({ where: { id: 1 }, data });
  }
}
