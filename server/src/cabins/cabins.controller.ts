import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { CabinsService } from './cabins.service';
import { CreateCabinDto, UpdateCabinDto } from './dto/cabin.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { imageUploadOptions, publicUrlFor } from '../common/upload.config';

@UseGuards(JwtAuthGuard)
@Controller('cabins')
export class CabinsController {
  constructor(private readonly cabins: CabinsService) {}

  @Get()
  findAll() {
    return this.cabins.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.cabins.findOne(id);
  }

  @Post()
  @UseInterceptors(FileInterceptor('image', imageUploadOptions))
  create(
    @Body() dto: CreateCabinDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    return this.cabins.create({
      ...dto,
      // An uploaded file wins; otherwise keep whatever URL was sent, which is
      // how "duplicate cabin" reuses the original photo.
      image: image ? publicUrlFor(image.filename) : dto.image ?? null,
    });
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('image', imageUploadOptions))
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCabinDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    const data: Record<string, unknown> = { ...dto };
    if (image) data.image = publicUrlFor(image.filename);
    return this.cabins.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.cabins.remove(id);
  }
}
