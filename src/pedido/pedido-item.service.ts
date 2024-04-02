import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ServicoInterface } from '../interfaces/servicos.interface';
import { ClientSession } from 'mongodb';
import { PedidoService } from './pedido.service';
import { InsertPedidoItemDto } from '../dtos/insert-pedido-item.dto';
import { PedidoItem } from '../schemas/pedido-item.schema';

const POPULATE = [
  {
    path: 'prato',
    populate: {
      path: 'grupo',
    },
  },
  {
    path: 'acompanhamentos',
    populate: {
      path: 'grupo',
    },
  },
];

@Injectable()
export class PedidoItemService implements ServicoInterface {
  constructor(
    @InjectModel(PedidoItem.name) private model: Model<PedidoItem>,
    @Inject(forwardRef(() => PedidoService))
    private readonly pedidoService: PedidoService,
  ) {}

  async create(valueDto: InsertPedidoItemDto): Promise<PedidoItem> {
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
      observacao: valueDto.observacao,
    });
    return (await createdCat.save()).populate(POPULATE);
  }

  findById(id: string): Promise<any> {
    throw new Error('Method not implemented.');
  }

  findAll(): Promise<any[]> {
    throw new Error('Method not implemented.');
  }

  async delete(id: string): Promise<boolean> {
    const pedidoItem = await this.model.findByIdAndDelete(id).exec();

    if (pedidoItem != null) {
      setTimeout(() => {
        this.model
          .countDocuments({ pedido: pedidoItem.pedido })
          .then((conta: number) => {
            if (conta === 0) {
              this.pedidoService.delete(String(pedidoItem.pedido)).then();
            }
          });
      }, 300);
    }

    return pedidoItem !== null;
  }

  async update(id: string, valueDto: any): Promise<any> {
    return this.model
      .findByIdAndUpdate({ _id: id.toObjectId() }, valueDto, {
        new: true,
      })
      .populate(POPULATE)
      .exec();
  }

  async carregarItens(pedidoId: string) {
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
