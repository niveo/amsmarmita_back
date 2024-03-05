import { IsNotEmpty } from 'class-validator';

export class InsertPratoDto {
  @IsNotEmpty()
  nome: string;

  @IsNotEmpty()
  grupoId: string;
}
