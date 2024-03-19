import { Module, forwardRef } from '@nestjs/common';
import { PedidoService } from './pedido.service';
import { PedidoController } from './pedido.controller';
import { MarmitaModule } from '../marmita/marmita.module';
import { PedidoPratoService } from './pedido-prato.service';
import { PrismaService } from '../services/prisma.service';

@Module({
  controllers: [PedidoController],
  providers: [PedidoService, PedidoPratoService, PrismaService],
  exports: [PedidoService],
  imports: [
    forwardRef(() => MarmitaModule),
  ],
})
export class PedidoModule { }
