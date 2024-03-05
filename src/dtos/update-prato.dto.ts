import { IsNotEmpty } from 'class-validator';

export class UpdatePratoDto {
  @IsNotEmpty()
  nome: string;

  @IsNotEmpty()
  grupoId: string;

  composicoes: string[];

  observacao: string;
}
