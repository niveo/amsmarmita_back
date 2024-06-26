import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class InsertComerdoresDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 25)
  nome: string;

  @IsString()
  @IsOptional()
  @Length(0, 37)
  foto?: string;
}
