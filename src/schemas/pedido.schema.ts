import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Comedor } from './comedor.schema';
import { PedidoPrato } from './pedido-prato.schema';
import { Marmita } from './marmita.schema';
import { Type } from 'class-transformer';

export type PedidoDocument = HydratedDocument<Pedido>;

@Schema({
  collection: 'pedidos',
})
export class Pedido {
  @Prop({ type: Types.ObjectId, ref: 'Marmita', required: true })
  @Type(() => Marmita)
  marmita: Marmita;

  @Prop({ type: Types.ObjectId, ref: 'Comedor', required: true })
  @Type(() => Comedor)
  comedor: Comedor;

  @Prop({
    type: [{ type: Types.ObjectId, ref: PedidoPrato.name }],
  })
  @Type(() => PedidoPrato)
  pratos: PedidoPrato[];
}

export const PedidoSchema = SchemaFactory.createForClass(Pedido);

PedidoSchema.index(
  { marmita: 'asc', comedor: 'asc' },
  {
    unique: true,
  },
);
