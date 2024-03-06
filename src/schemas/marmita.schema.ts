import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type MarmitaDocument = HydratedDocument<Marmita>;

@Schema({
  collection: 'marmitas',
})
export class Marmita {
  @Prop()
  lancamento: Date;

  @Prop()
  observacao: string;
}

export const MarmitaSchema = SchemaFactory.createForClass(Marmita);
