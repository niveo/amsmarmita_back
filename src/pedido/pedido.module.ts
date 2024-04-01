import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PedidoService } from './pedido.service';
import { Pedido, PedidoSchema } from './pedido.schema';
import { PedidoPrato, PedidoPratoSchema } from './pedido-prato.schema';
import { PedidoController } from './pedido.controller';
import { MarmitaModule } from '../marmita/marmita.module';
import { PedidoPratoService } from './pedido-prato.service';
import { PedidoPratoController } from './pedido-prato.controller';
import { Grupo, GrupoSchema } from '../schemas/grupo.schema';

@Module({
  controllers: [PedidoController, PedidoPratoController],
  providers: [PedidoService, PedidoPratoService],
  exports: [PedidoService],
  imports: [
    forwardRef(() => MarmitaModule),
    MongooseModule.forFeature([
      {
        name: Pedido.name,
        schema: PedidoSchema,
      },

      {
        name: PedidoPrato.name,
        schema: PedidoPratoSchema,
      },

      {
        name: Grupo.name,
        schema: GrupoSchema,
      },
    ]),
  ],
})
export class PedidoModule {}
