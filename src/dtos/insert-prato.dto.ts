import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class InsertPratoDto {
  @IsString()
  @IsNotEmpty()
  nome: string;

  @IsString()
  @IsNotEmpty()
  grupo?: string;

  @IsArray()
  composicoes?: string[];

  @IsString()
  observacao?: string;
}
