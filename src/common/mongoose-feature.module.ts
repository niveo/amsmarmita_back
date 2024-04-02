import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Comedor,
  ComedorSchema,
  Grupo,
  GrupoSchema,
  Marmita,
  MarmitaSchema,
  Pedido,
  PedidoItem,
  PedidoItemSchema,
  PedidoSchema,
  Prato,
  PratoSchema,
} from '../schemas';
@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Pedido.name,
        schema: PedidoSchema,
      },

      {
        name: PedidoItem.name,
        schema: PedidoItemSchema,
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
