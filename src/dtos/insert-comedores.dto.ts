import { IsNotEmpty, Length } from "class-validator";

export class InsertComerdoresDto {

  @Length(5, 25)
  @IsNotEmpty()
  nome: string;
}
