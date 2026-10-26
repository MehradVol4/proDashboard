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

import { GuestsService } from './guests.service';
import { CreateGuestDto, QueryGuestsDto, UpdateGuestDto } from './dto/guest.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('guests')
export class GuestsController {
  constructor(private readonly guests: GuestsService) {}

  // Declared before ':id' so the literal path is not swallowed by the param.
  @Get('all')
  findAll() {
    return this.guests.findAll();
  }

  @Get()
  findPage(@Query() query: QueryGuestsDto) {
    return this.guests.findPage(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.guests.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateGuestDto) {
    return this.guests.create(dto);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateGuestDto) {
    return this.guests.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.guests.remove(id);
  }
}
