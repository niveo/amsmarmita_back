import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class InsertPedidoItemDto {
  @IsString()
  @IsNotEmpty()
  @Length(24, 24)
  comedor: string;

  @IsString()
  @IsNotEmpty()
  @Length(24, 24)
  marmita: string;

  @IsString()
  @IsNotEmpty()
  @Length(24, 24)
  prato: string;

  @IsNotEmpty()
  @IsNumber()
  quantidade: number;

  @IsArray()
  acompanhamentos: string[] = [];

  @IsString()
  @IsOptional()
  @Length(0, 100)
  observacao?: string;
}
