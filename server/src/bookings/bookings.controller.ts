import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { BookingsService } from './bookings.service';
import {
  CreateBookingDto,
  QueryBookingsDto,
  UpdateBookingDto,
} from './dto/booking.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookings: BookingsService) {}

  // Literal paths are declared before ':id' so the param route does not
  // swallow them.
  @Get('today-activity')
  todayActivity() {
    return this.bookings.findTodayActivity();
  }

  @Get('created-after')
  createdAfter(@Query('date') date: string) {
    return this.bookings.findCreatedAfter(date);
  }

  @Get('stays-after')
  staysAfter(@Query('date') date: string) {
    return this.bookings.findStaysAfter(date);
  }

  @Get('cabin/:cabinId/ranges')
  cabinRanges(@Param('cabinId', ParseIntPipe) cabinId: number) {
    return this.bookings.findCabinRanges(cabinId);
  }

  @Get('guest/:guestId')
  byGuest(@Param('guestId', ParseIntPipe) guestId: number) {
    return this.bookings.findByGuest(guestId);
  }

  @Get()
  findPage(@Query() query: QueryBookingsDto) {
    return this.bookings.findPage(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.bookings.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateBookingDto) {
    return this.bookings.create(dto);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateBookingDto) {
    return this.bookings.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.bookings.remove(id);
  }
}
