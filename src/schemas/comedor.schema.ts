import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ComedorDocument = HydratedDocument<Comedor>;

@Schema({
  collection: 'comedores',
})
export class Comedor {
  _id: Types.ObjectId;
  @Prop({
    index: 'asc',
    isRequired: true,
    maxlength: 25,
  })
  nome: string;
}

export const ComedorSchema = SchemaFactory.createForClass(Comedor);
