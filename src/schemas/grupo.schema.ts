import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type GrupoDocument = HydratedDocument<Grupo>;

@Schema()
export class Grupo {
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
  principal: boolean = false;

  @Prop({
    max: 100,
    maxlength: 100,
  })
  observacao: string;
}

export const GrupoSchema = SchemaFactory.createForClass(Grupo);
