import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Pedido } from './pedido.schema';
import { Type } from 'class-transformer';

export type MarmitaDocument = HydratedDocument<Marmita>;

@Schema({
  collection: 'marmitas',
})
export class Marmita {
  //@Prop({ type: Types.ObjectId, _id: true  })
  _id: Types.ObjectId;

  @Prop()
  lancamento: Date;

  @Prop()
  observacao: string;

  //@Prop({ type: Types.ObjectId, ref: Pedido.name })
  @Prop({
    type: [{ type: Types.ObjectId, ref: Pedido.name }],
  })
  @Type(() => Pedido)
  pedidos: Pedido[];
}

export const MarmitaSchema = SchemaFactory.createForClass(Marmita);
