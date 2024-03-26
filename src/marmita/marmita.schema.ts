import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

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

  @Prop({
    max: 100,
    maxlength: 100,
  })
  observacao: string;
}

export const MarmitaSchema = SchemaFactory.createForClass(Marmita);
