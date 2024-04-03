import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class InsertIngredienteDto {
  @IsString()
  @IsNotEmpty()
  @Length(2, 50)
  nome: string;

  @IsString()
  @IsOptional()
  @Length(0, 100)
  observacao?: string;
}
