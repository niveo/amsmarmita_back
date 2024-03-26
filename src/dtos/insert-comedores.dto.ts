import { IsNotEmpty, IsString, Length } from 'class-validator';

export class InsertComerdoresDto {
  @IsString()
  @IsNotEmpty()
  @Length(5, 25)
  nome: string;
}
