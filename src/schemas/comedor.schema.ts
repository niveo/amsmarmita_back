import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ComedorDocument = HydratedDocument<Comedor>;

@Schema({
  collection: 'comedores',
})
export class Comedor {
  @Prop({
    index: 'asc',
    isRequired: true,
    max: 25,
    maxlength: 25,
  })
  nome: string;
}

export const ComedorSchema = SchemaFactory.createForClass(Comedor);
