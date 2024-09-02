import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { v4 } from 'uuid';

export type ParametrosDocument = HydratedDocument<Parametros>;

@Schema({
    collection: 'parametros',
    timestamps: true,
})
export class Parametros {
    _id: Types.ObjectId;
    
    @Prop({
        isRequired: true
    })
    valor: string;

    @Prop({
        isRequired: true
    })
    chave: string = v4().toString();

    @Prop({ index: 'asc', type: 'number' })
    createdAt: number;

    @Prop({ index: 'asc', type: 'number' })
    updatedAt: number;
}

export const ParametrosSchema = SchemaFactory.createForClass(Parametros);
