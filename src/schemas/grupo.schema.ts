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
    maxlength: 100,
  })
  observacao: string;

  @Prop({
    maxlength: 7,
  })
  cor: string;

  @Prop({
    default: false,
  })
  somarRelatorio: boolean;
}

export const GrupoSchema = SchemaFactory.createForClass(Grupo);
