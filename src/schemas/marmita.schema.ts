import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Pedido } from '../pedido/pedido.schema';

export type MarmitaDocument = HydratedDocument<Marmita>;

@Schema({
  collection: 'marmitas',
})
export class Marmita {
  _id: Types.ObjectId;

  @Prop({
    index: 'asc',
  })
  lancamento: Date;

  @Prop()
  observacao: string;

  @Prop({ type: [Types.ObjectId], ref: Pedido.name, required: true })
  pedidos: Pedido[];
}

export const MarmitaSchema = SchemaFactory.createForClass(Marmita);
