import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ComedorDocument = HydratedDocument<Comedor>;

@Schema({
  collection: 'comedores',
  timestamps: true,
})
export class Comedor {
  _id: Types.ObjectId;
  @Prop({
    index: 'asc',
    isRequired: true,
    maxlength: 25,
  })
  nome: string;

  @Prop({
    maxlength: 37,
  })
  foto: string;

  @Prop({ index: 'asc', type: 'number' })
  createdAt: number;

  @Prop({ index: 'asc', type: 'number' })
  updatedAt: number;
}

export const ComedorSchema = SchemaFactory.createForClass(Comedor);
