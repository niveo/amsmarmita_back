import { IsNotEmpty, Length } from 'class-validator';

export class UpdateGrupoDto {
  
  @Length(5, 25) 
  @IsNotEmpty()
  nome: string;

  
  @Length(0, 100) 
  observacao?: string;
}
