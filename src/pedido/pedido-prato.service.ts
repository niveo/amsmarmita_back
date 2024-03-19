import { Injectable } from "@nestjs/common";
import { ServicoInterface } from "../interfaces/servicos.interface";

@Injectable()
export class PedidoPratoService implements ServicoInterface {
  create(enity: any): Promise<any> {
    throw new Error("Method not implemented.");
  }
  findById(id: string): Promise<any> {
    throw new Error("Method not implemented.");
  }
  findAll(): Promise<any[]> {
    throw new Error("Method not implemented.");
  }
  async delete(id: string): Promise<any> {
    throw new Error("Method not implemented.");
  }

  update(id: string, entity: any): Promise<any> {
    throw new Error("Method not implemented.");
  }
}
