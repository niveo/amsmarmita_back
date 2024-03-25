import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PedidoPrato } from './pedido-prato.schema';
import { Model } from 'mongoose';
import { ServicoInterface } from '../interfaces/servicos.interface';

@Injectable()
export class PedidoPratoService implements ServicoInterface {
  constructor(
    @InjectModel(PedidoPrato.name) private model: Model<PedidoPrato>,
  ) {}
  create(enity: any): Promise<any> {
    throw new Error('Method not implemented.');
  }
  findById(id: string): Promise<any> {
    throw new Error('Method not implemented.');
  }
  findAll(): Promise<any[]> {
    throw new Error('Method not implemented.');
  }
  async delete(id: string): Promise<any> {
    return (await this.model.deleteOne({ _id: id }).exec()).deletedCount;
  }

  async deletePrato(id: string, session: any): Promise<any> {
    return (await this.model.deleteOne({ prato: id }).exec()).deletedCount;
  }

  update(id: string, entity: any): Promise<any> {
    throw new Error('Method not implemented.');
  }
}
