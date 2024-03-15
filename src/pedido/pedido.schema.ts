import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Type } from 'class-transformer';
import { Marmita } from '../schemas/marmita.schema';
import { Comedor } from '../schemas/comedor.schema';
import { PedidoPrato } from './pedido-prato.schema';

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

  @Prop({ type: [Types.ObjectId], ref: PedidoPrato.name, required: true })
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
