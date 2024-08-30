import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Length } from 'class-validator';
import { TipoIngrediente } from '../enuns/tipoingrediente.enum';
import { TipoMedida } from '../enuns/tipomedida.enum';

export class InsertIngredienteDto {
  @IsString()
  @IsNotEmpty()
  @Length(2, 50)
  nome: string;

  @IsString()
  @IsOptional()
  @Length(0, 100)
  observacao?: string;

  @IsOptional()
  @IsEnum(TipoMedida)
  medida?: TipoMedida;

  @IsOptional()
  @IsEnum(TipoIngrediente)
  tipo?: TipoIngrediente;

  @IsNumber()
  @IsOptional()
  embalagemQuantidade?: number;

  @IsOptional()
  @IsEnum(TipoMedida)
  embalagemMedida?: TipoMedida;
}
