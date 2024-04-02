import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Type } from 'class-transformer';
import { Marmita } from './marmita.schema';
import { Comedor } from './comedor.schema';
export type PedidoDocument = HydratedDocument<Pedido>;

@Schema({
  collection: 'pedidos',
})
export class Pedido {
  _id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Marmita', required: true })
  @Type(() => Marmita)
  marmita: Marmita;

  @Prop({ type: Types.ObjectId, ref: 'Comedor', required: true })
  @Type(() => Comedor)
  comedor: Comedor;
}

export const PedidoSchema = SchemaFactory.createForClass(Pedido);

PedidoSchema.index(
  { comedor: 'asc', marmita: 'asc' },
  {
    unique: true,
  },
);
