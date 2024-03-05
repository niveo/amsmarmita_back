import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Grupo } from './grupo.schema';

export type PratosDocument = HydratedDocument<Pratos>;

@Schema()
export class Pratos {
  @Prop({
    index: 'asc',
    isRequired: true,
    max: 50,
    maxlength: 50,
  })
  nome: string;

  @Prop({ type: Types.ObjectId, ref: 'Grupo', required: true })
  grupo: Grupo;

  @Prop([String])
  composicoes: string[];

  @Prop({
    max: 100,
    maxlength: 100,
  })
  observacao: string;
}

export const PratosSchema = SchemaFactory.createForClass(Pratos);
