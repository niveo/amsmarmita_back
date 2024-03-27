import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class InsertMarmitaDto {
  @IsDateString()
  @IsNotEmpty()
  lancamento: Date;

  @IsString()
  @IsOptional()
  @Length(0, 100)
  observacao?: string;
}
