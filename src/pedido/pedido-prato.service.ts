import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PedidoPrato } from './pedido-prato.schema';
import { Model } from 'mongoose';
import { ServicoInterface } from '../interfaces/servicos.interface';
import { ClientSession } from 'mongodb';
import { InsertPedidoPratoDto } from '../dtos/insert-pedido-prato.dto';
import { PedidoService } from './pedido.service';

const POPULATE = [
  {
    path: 'prato',
    select: ['grupo', 'nome'],
  },
  {
    path: 'acompanhamentos',
    populate: {
      path: 'grupo',
    },
  },
];

@Injectable()
export class PedidoPratoService implements ServicoInterface {
  constructor(
    @InjectModel(PedidoPrato.name) private model: Model<PedidoPrato>,
    @Inject(forwardRef(() => PedidoService))
    private readonly pedidoService: PedidoService,
  ) {}

  async create(valueDto: InsertPedidoPratoDto): Promise<PedidoPrato> {
    let pedido = await this.pedidoService.obterPedidoId(
      valueDto.marmita,
      valueDto.comedor,
    );

    if (pedido == null) {
      pedido = await this.pedidoService.create({
        marmita: valueDto.marmita.toObjectId(),
        comedor: valueDto.comedor.toObjectId(),
      });
    }

    const createdCat = new this.model({
      pedido: pedido._id,
      prato: valueDto.prato.toObjectId(),
      quantidade: valueDto.quantidade,
      acompanhamentos: valueDto.acompanhamentos,
    });
    return (await createdCat.save()).populate(POPULATE);
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
      .populate(POPULATE)
      .exec();
  }

  async carregarPedidoPratos(pedidoId: string) {
    return this.model
      .find({ pedido: pedidoId.toObjectId() })
      .populate(POPULATE);
  }

  deletePedidoId(id: string, session: ClientSession) {
    return this.model
      .deleteMany({ pedido: id.toObjectId() })
      .session(session)
      .exec();
  }
}
