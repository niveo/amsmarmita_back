import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Type } from 'class-transformer';
import { Comedor } from '../schemas/comedor.schema';
import { PedidoPrato } from './pedido-prato.schema';

export type PedidoDocument = HydratedDocument<Pedido>;

@Schema({
  collection: 'pedidos',
})
export class Pedido {
  @Prop({ type: Types.ObjectId, ref: 'Comedor', required: true })
  @Type(() => Comedor)
  comedor: Comedor;

  @Prop({ type: [Types.ObjectId], ref: PedidoPrato.name, required: true })
  @Type(() => PedidoPrato)
  pratos: PedidoPrato[];
}

export const PedidoSchema = SchemaFactory.createForClass(Pedido);

PedidoSchema.index(
  { comedor: 'asc' },
  {
    unique: true,
  },
);
