import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Comedor,
  ComedorSchema,
  Grupo,
  GrupoSchema,
  Ingrediente,
  IngredienteSchema,
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
      { name: Ingrediente.name, schema: IngredienteSchema },
    ]),
  ],
  exports: [MongooseModule],
})
export class MongooseFeatureMogule {}
