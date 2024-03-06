import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Comedor } from './comedor.schema';

export type PedidosDocument = HydratedDocument<Pedidos>;

@Schema({
  collection: 'pedidos',
})
export class Pedidos {
  @Prop({ type: Types.ObjectId, ref: 'Comedor', required: true })
  comedor: Comedor;

  @Prop([String])
  pratos: string[];
}

export const PedidosSchema = SchemaFactory.createForClass(Pedidos);
