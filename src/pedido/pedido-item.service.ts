import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PipelineStage } from 'mongoose';
import { ServicoInterface } from '../interfaces/servicos.interface';
import { ClientSession } from 'mongodb';
import { PedidoService } from './pedido.service';
import { InsertPedidoItemDto } from '../dtos/insert-pedido-item.dto';
import { PedidoItem } from '../schemas/pedido-item.schema';
import '../common/prototype.extensions';

const unsetGrupo = ['observacao', '__v', 'cor', 'principal'];
const unsetPrato = ['observacao', '__v', 'composicoes'];

const aggregate: PipelineStage[] = [
  {
    $lookup: {
      from: 'pedidos',
      localField: 'pedido',
      foreignField: '_id',
      pipeline: [
        {
          $lookup: {
            from: 'marmitas',
            localField: 'marmita',
            foreignField: '_id',
            pipeline: [
              {
                $match: {
                  _id: '660c717d90c39e1a134e9b39'.toObjectId(),
                },
              },
              {
                $unset: ['__v'],
              },
            ],
            as: 'marmita',
          },
        },
        {
          $lookup: {
            from: 'comedores',
            localField: 'comedor',
            foreignField: '_id',
            as: 'comedor',
          },
        },
        {
          $unset: ['observacao', '__v'],
        },
        {
          $unwind: '$comedor',
        },
        {
          $unwind: '$marmita',
        },
      ],
      as: 'pedido',
    },
  },
  {
    $unwind: '$pedido',
  },
  {
    $unset: ['observacao', '__v'],
  },
  {
    $lookup: {
      from: 'pratos',
      localField: 'prato',
      foreignField: '_id',
      pipeline: [
        {
          $unset: unsetPrato,
        },
        {
          $lookup: {
            from: 'grupos',
            localField: 'grupo',
            foreignField: '_id',
            pipeline: [
              {
                $unset: unsetGrupo,
              },
            ],
            as: 'grupo',
          },
        },
        {
          $unwind: '$grupo',
        },
      ],
      as: 'prato',
    },
  },
  {
    $unwind: '$prato',
  },

  {
    $lookup: {
      from: 'pratos',
      localField: 'acompanhamentos',
      foreignField: '_id',
      pipeline: [
        {
          $unset: unsetPrato,
        },
        {
          $lookup: {
            from: 'grupos',
            localField: 'grupo',
            foreignField: '_id',
            pipeline: [
              {
                $unset: unsetGrupo,
              },
            ],
            as: 'grupo',
          },
        },
        {
          $unwind: '$grupo',
        },
      ],
      as: 'acompanhamentos',
    },
  },
  /*
  {
    $unwind: '$acompanhamentos',
  }, */
];

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
        marmita: valueDto.marmita,
        comedor: valueDto.comedor,
      });
    }

    const createdCat = new this.model({
      pedido: pedido._id,
      quantidade: valueDto.quantidade,
      prato: valueDto.prato.toObjectId(),
      acompanhamentos: valueDto.acompanhamentos?.map((m) => m.toObjectId()),
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
      .findByIdAndUpdate(
        { _id: id.toObjectId() },
        {
          ...valueDto,
          prato: valueDto.prato.toObjectId(),
          acompanhamentos: valueDto.acompanhamentos?.map((m) => m.toObjectId()),
        },
        {
          new: true,
        },
      )
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
