import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class InsertGrupoDto {
  @IsString()
  @IsNotEmpty()
  @Length(5, 25)
  nome: string;

  @IsString()
  @IsOptional()
  @Length(0, 100)
  observacao?: string;

  @IsBoolean()
  @IsNotEmpty()
  principal?: boolean = false;

  @IsBoolean()
  @IsNotEmpty()
  multiplo?: boolean = false;


  @IsString()
  @IsOptional()
  @Length(0, 7)
  cor?: string;
}
