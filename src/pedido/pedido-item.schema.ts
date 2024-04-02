import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Type } from 'class-transformer';
import { Prato } from '../prato/prato.schema';
import { Pedido } from './pedido.schema';
export type PedidoItemDocument = HydratedDocument<PedidoItem>;

@Schema({
  collection: 'pedidos_itens',
})
export class PedidoItem {
  _id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Pedido', required: true })
  @Type(() => Pedido)
  pedido: Pedido;

  @Prop({ type: Types.ObjectId, ref: Prato.name, required: true })
  @Type(() => Prato)
  prato: Prato;

  @Prop({ type: [Types.ObjectId], ref: 'Prato' })
  @Type(() => Prato)
  acompanhamentos: Prato[];

  @Prop({
    isRequired: true,
    isInteger: true,
  })
  quantidade: number;
}

export const PedidoItemSchema = SchemaFactory.createForClass(PedidoItem);

PedidoItemSchema.index(
  { prato: 'asc', pedido: 'asc' },
  {
    unique: true,
  },
);
