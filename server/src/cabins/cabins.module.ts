import { Module } from '@nestjs/common';
import { CabinsService } from './cabins.service';
import { CabinsController } from './cabins.controller';

@Module({
  controllers: [CabinsController],
  providers: [CabinsService],
})
export class CabinsModule {}
