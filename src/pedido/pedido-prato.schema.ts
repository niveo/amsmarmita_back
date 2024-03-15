import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Type } from 'class-transformer';
import { Prato } from '../prato/prato.schema';
import { Pedido } from './pedido.schema';
export type PedidoPratoDocument = HydratedDocument<PedidoPrato>;

@Schema({
  collection: 'pedidos_pratos',
})
export class PedidoPrato {
/*   @Prop({ type: Types.ObjectId, ref: Pedido.name })
  @Type(() => Pedido)
  pedido: Pedido; */

  @Prop({ type: Types.ObjectId, ref: Prato.name })
  @Type(() => Prato)
  prato: Prato;

  @Prop({
    isRequired: true,
    isInteger: true,
  })
  quantidade: number;
}

export const PedidoPratoSchema = SchemaFactory.createForClass(PedidoPrato);
