import { Module } from '@nestjs/common';
import { MarmitaController } from './marmita.controller';
import { MarmitaService } from './marmita.service';
import { PrismaService } from '../services/prisma.service';

@Module({
  controllers: [MarmitaController],
  providers: [MarmitaService, PrismaService],
  exports: [MarmitaService],
  imports: [],
})
export class MarmitaModule {
}
