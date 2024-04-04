import { IsNotEmpty, IsString, Length } from 'class-validator';

export class InsertPedidoDto {
  @IsString()
  @IsNotEmpty()
  @Length(24, 24)
  comedor: string;

  @IsString()
  @IsNotEmpty()
  @Length(24, 24)
  marmita: string;
}
