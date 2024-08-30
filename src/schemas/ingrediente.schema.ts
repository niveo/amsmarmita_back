import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { TipoIngrediente } from 'src/enuns/tipoingrediente.enum';
import { TipoMedida } from 'src/enuns/tipomedida.enum';

export type IngredienteDocument = HydratedDocument<Ingrediente>;

@Schema({
  collection: 'ingredientes',
})
export class Ingrediente {
  _id: Types.ObjectId;
  @Prop({
    index: 'asc',
    isRequired: true,
    unique: true,
    minlength: 2,
    maxlength: 50,
  })
  nome: string;

  @Prop({
    maxlength: 100,
  })
  observacao: string;

  @Prop({
    type: String,
    enum: TipoIngrediente,
  })
  tipo: TipoIngrediente;

  @Prop({
    type: String,
    enum: TipoMedida
  })
  medida: TipoMedida;


  @Prop({ type: 'number' })
  embalagemQuantidade: number;

  @Prop({
    type: String,
    enum: TipoMedida
  })
  embalagemMedida: TipoMedida;
}

export const IngredienteSchema = SchemaFactory.createForClass(Ingrediente);
