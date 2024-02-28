import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ComedoresDocument = HydratedDocument<Comedores>;

@Schema()
export class Comedores {
  @Prop()
  nome: string;
}

export const ComedoresSchema = SchemaFactory.createForClass(Comedores);
