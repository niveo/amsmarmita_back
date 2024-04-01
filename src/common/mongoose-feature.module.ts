import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PedidoPrato, PedidoPratoSchema } from '../pedido/pedido-prato.schema';
import { Pedido, PedidoSchema } from '../pedido/pedido.schema';
import { Grupo, GrupoSchema } from '../schemas/grupo.schema';
import { Comedor, ComedorSchema } from '../schemas/comedor.schema';
import { Marmita, MarmitaSchema } from '../marmita/marmita.schema';
import { Prato, PratoSchema } from '../prato/prato.schema';

@Module({
  imports: [
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
        name: Marmita.name,
        schema: MarmitaSchema,
      },
      { name: Prato.name, schema: PratoSchema },
      {
        name: Grupo.name,
        schema: GrupoSchema,
      },
      { name: Comedor.name, schema: ComedorSchema },
    ]),
  ],
  exports: [MongooseModule],
})
export class MongooseFeatureMogule {}
