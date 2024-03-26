import { HttpException, HttpStatus } from "@nestjs/common";

export class ErroInternoException extends HttpException {
  constructor(erro: String) {
    super(erro, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

