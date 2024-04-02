import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type GrupoDocument = HydratedDocument<Grupo>;

@Schema({
  collection: 'grupos',
})
export class Grupo {
  _id: Types.ObjectId;

  @Prop({
    index: 'asc',
    isRequired: true,
    max: 25,
    maxlength: 25,
  })
  nome: string;

  @Prop({
    isRequired: true,
    default: false,
  })
  principal: boolean;

  @Prop({
    isRequired: true,
    default: false,
  })
  multiplo: boolean;

  @Prop({
    max: 100,
    maxlength: 100,
  })
  observacao: string;
}

export const GrupoSchema = SchemaFactory.createForClass(Grupo);
