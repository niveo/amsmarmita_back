import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class InsertPratoDto {
  @IsString()
  @IsNotEmpty()
  @Length(5, 50)
  nome: string;

  @IsString()
  @IsNotEmpty()
  @Length(24, 24)
  grupo?: string;

  @IsArray()
  @IsOptional()
  composicoes?: string[];

  @IsString()
  @IsOptional()
  @Length(0, 100)
  observacao?: string;

  @IsString()
  @IsOptional()
  @Length(0, 50)
  icone?: string;

  @IsString()
  @IsOptional() 
  imagem?: string;

  @IsArray()
  @IsOptional()
  ingredientes?: string[];
}
