import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Pedido } from './pedido.schema';
import { Type } from 'class-transformer';
import { Prato } from './prato.schema';

export type PedidoPratoDocument = HydratedDocument<PedidoPrato>;

@Schema({
  collection: 'pedidos_pratos',
})
export class PedidoPrato {
  @Prop({ type: Types.ObjectId, ref: 'Pedido' })
  @Type(() => Pedido)
  pedido: Pedido;

  @Prop({ type: Types.ObjectId, ref: 'Prato' })
  @Type(() => Prato)
  prato: Prato;

  @Prop({
    isRequired: true,
    isInteger: true,
  })
  quantidade: number;
}

export const PedidoPratoSchema = SchemaFactory.createForClass(PedidoPrato);
