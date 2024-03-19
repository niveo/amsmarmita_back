import { Length, IsNotEmpty } from "class-validator";

export class UpdateComerdoresDto {
  @Length(5, 25)
  @IsNotEmpty()
  nome: string;
}
