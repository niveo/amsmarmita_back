import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type IngredienteDocument = HydratedDocument<Ingrediente>;

@Schema({
  collection: 'ingredientes',
})
export class Ingrediente {
  _id: Types.ObjectId;
  @Prop({
    index: 'asc',
    isRequired: true,
    minlength: 2,
    maxlength: 50,
  })
  nome: string;

  @Prop({
    maxlength: 100,
  })
  observacao: string;
}

export const IngredienteSchema = SchemaFactory.createForClass(Ingrediente);
