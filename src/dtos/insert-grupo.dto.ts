import { IsNotEmpty } from 'class-validator';

export class InsertGrupoDto {
  @IsNotEmpty()
  nome: string;

  observacao?: string;
}
