
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Ingrediente } from './ingrediente.schema';
import { Type } from 'class-transformer';
import { TipoMedida } from '../enuns/tipomedida.enum';
//export type PratoDocument = HydratedDocument<PratoIngrediente>;
@Schema({
    collection: 'pratos_ingredientes',
})
export class PratoIngrediente {
    _id: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: Ingrediente.name, required: true, select: true })
    @Type(() => Ingrediente)
    ingrediente: Ingrediente;

    @Prop({
        type: String,
        enum: TipoMedida
    })
    medida: TipoMedida;

    @Prop({ type: 'number' })
    quantidade: number;

}


//export const PratoIngredienteSchema = SchemaFactory.createForClass(PratoIngrediente);