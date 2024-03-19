import { Module } from '@nestjs/common';
import { PratoController } from './prato.controller';
import { PratoService } from './prato.service';
import { PrismaService } from '../services/prisma.service';

@Module({
  controllers: [PratoController],
  providers: [PratoService, PrismaService],
  exports: [PratoService],
})
export class PratoModule { }
