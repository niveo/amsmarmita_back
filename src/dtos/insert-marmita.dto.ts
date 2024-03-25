import {
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class InsertMarmitaDto {
  @IsDate()
  @IsNotEmpty()
  lancamento: Date;

  @IsString()
  @IsOptional()
  @Length(0, 100)
  observacao: string;
}
