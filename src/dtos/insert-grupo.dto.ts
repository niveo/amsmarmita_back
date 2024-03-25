import { IsBoolean, IsNotEmpty, IsString, Length } from 'class-validator';

export class InsertGrupoDto {
  @IsString()
  @IsNotEmpty()
  @Length(5, 25)
  nome: string;

  @Length(0, 100)
  @IsString()
  observacao?: string;

  @IsBoolean()
  principal?: boolean = false;
}
