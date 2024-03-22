import { IsNotEmpty } from 'class-validator';

export class UpdateGrupoDto {
  @IsNotEmpty()
  nome: string;
  observacao?: string;
  principal?: boolean = false;
}
