import { IsNotEmpty, IsNumber, IsString, Length } from 'class-validator';

export class InsertPedidoPratoDto {
  @IsString()
  @IsNotEmpty()
  @Length(25, 25)
  pedido: string;

  @IsString()
  @IsNotEmpty()
  @Length(25, 25)
  prato: string;

  @IsNotEmpty()
  @IsNumber()
  quantidade: number;
}
