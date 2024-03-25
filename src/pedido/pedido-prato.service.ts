import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PedidoPrato } from './pedido-prato.schema';
import { Model } from 'mongoose';
import { ServicoInterface } from '../interfaces/servicos.interface';
import { ClientSession } from 'mongodb';
import { InsertPedidoPratoDto } from '../dtos/insert-pedido-prato.dto';

@Injectable()
export class PedidoPratoService implements ServicoInterface {
  constructor(
    @InjectModel(PedidoPrato.name) private model: Model<PedidoPrato>,
  ) {}

  async create(valueDto: InsertPedidoPratoDto): Promise<string> {
    const createdCat = new this.model({
      pedido: valueDto.pedido.toObjectId(),
      prato: valueDto.prato.toObjectId(),
      quantidade: valueDto.quantidade,
    });
    return (await createdCat.save())._id.toString();
  }

  findById(id: string): Promise<any> {
    throw new Error('Method not implemented.');
  }

  findAll(): Promise<any[]> {
    throw new Error('Method not implemented.');
  }

  async delete(id: string): Promise<any> {
    return (await this.model.deleteOne({ _id: id }).exec()).deletedCount > 0;
  }

  async update(id: string, valueDto: any): Promise<any> {
    return this.model
      .findByIdAndUpdate({ _id: id.toObjectId() }, valueDto, {
        new: true,
      })
      .exec();
  }

  async carregarPedidoPratos(pedidoId: string) {
    return this.model.find({ pedido: pedidoId.toObjectId() }).populate({
      path: 'prato',
      select: 'grupo',
    });
  }

  deletePedidoId(id: string, session: ClientSession) {
    return this.model
      .deleteMany({ pedido: id.toObjectId() })
      .session(session)
      .exec();
  }
}
