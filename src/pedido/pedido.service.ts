import { Injectable } from '@nestjs/common';
import { ServicoInterface } from '../interfaces/servicos.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Pedido } from './pedido.schema';

@Injectable()
export class PedidoService implements ServicoInterface {
  constructor(@InjectModel(Pedido.name) private model: Model<Pedido>) {}

  async create(valueDto: any): Promise<Pedido> {
    const createdCat = new this.model(valueDto);
    return await createdCat.save();
  }

  async findById(id: string): Promise<Pedido> {
    return this.model.findById(id).exec();
  }

  async findAll(): Promise<Pedido[]> {
    return this.model.find().exec();
  }

  async delete(id: string): Promise<any> {
    return (await this.model.deleteOne({ _id: id }).exec()).deletedCount;
  }

  async update(id: string, valueDto: any): Promise<any> {
    return this.model.findByIdAndUpdate({ _id: id }, {}).exec();
  }

  async deleteMarmitaId(id: string): Promise<any> {
    const where = { marmita: id.toObjectId() };
    const conta = await this.model.where(where).countDocuments().exec();
    if (conta === 0) return true;
    return (await this.model.deleteOne(where).exec()).deletedCount > 0;
  }
}
