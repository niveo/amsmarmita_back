import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type MarmitaDocument = HydratedDocument<Marmita>;

@Schema()
export class Marmita {
  @Prop()
  lancamento: Date;

  @Prop()
  observacao: string;
}

export const MarmitaSchema = SchemaFactory.createForClass(Marmita);
