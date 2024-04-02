import {
  IsArray,
  IsNotEmpty,
  IsNumber,
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
}
