import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Grupo } from './grupo.schema';

export type PratoDocument = HydratedDocument<Prato>;

@Schema({
  collection: 'pratos',
})
export class Prato {
  _id: Types.ObjectId;

  @Prop({
    index: 'asc',
    isRequired: true,
    maxlength: 50,
  })
  nome: string;

  @Prop({ type: Types.ObjectId, ref: 'Grupo', required: true })
  grupo: Grupo;

  @Prop([String])
  composicoes: string[];

  @Prop({
    maxlength: 100,
  })
  observacao: string;
}

export const PratoSchema = SchemaFactory.createForClass(Prato);
