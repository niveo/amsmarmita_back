import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PipelineStage } from 'mongoose';
import { ServicoInterface } from '../interfaces/servicos.interface';
import { ClientSession } from 'mongodb';
import { PedidoService } from './pedido.service';
import { InsertPedidoItemDto } from '../dtos/insert-pedido-item.dto';
import { PedidoItem } from '../schemas/pedido-item.schema';
import '../common/prototype.extensions';
import {
  PedidoRelatorioComedorDto,
  PedidoRelatorioDto,
} from '../dtos/pedido-relatorio.dto';
import { v5 as uuidv5 } from 'uuid';

const unsetIngredientes = ['observacao', '__v'];
const unsetGrupo = [...unsetIngredientes, 'cor', 'principal'];
const unsetPrato = [...unsetIngredientes, 'composicoes'];

const aggregate = (marmitaId: string): PipelineStage[] => [
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
                  _id: marmitaId.toObjectId(),
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
        {
          $lookup: {
            from: 'ingredientes',
            localField: 'ingredientes',
            foreignField: '_id',
            pipeline: [{ $unset: unsetIngredientes }],
            as: 'ingredientes',
          },
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
        {
          $lookup: {
            from: 'ingredientes',
            localField: 'ingredientes',
            foreignField: '_id',
            pipeline: [{ $unset: unsetIngredientes }],
            as: 'ingredientes',
          },
        },
      ],
      as: 'acompanhamentos',
    },
  },
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
  sortPrincipal = (a, b) => Number(b.principal) - Number(a.principal);
  sortPrato = (a, b) => a.prato!.localeCompare(b.prato!);
  sortComedor = (a: PedidoRelatorioComedorDto, b: PedidoRelatorioComedorDto) =>
    a.comedor!.localeCompare(b.comedor!);

  constructor(
    @InjectModel(PedidoItem.name) private model: Model<PedidoItem>,
    @Inject(forwardRef(() => PedidoService))
    private readonly pedidoService: PedidoService,
  ) {
    /*  this.carregarRelatorio('660c717d90c39e1a134e9b39').then((ret) => {
      console.log(JSON.stringify(ret.geral, null, 4));
    }); */
  }

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

  carregarRelatorio(marmitaId: string): Promise<any> {
    const pratos = new Map<string, PedidoRelatorioDto>();
    const pratoGeral = new Map<
      string,
      { prato: string; quantidade: number; ingredientes: string[] }
    >();

    const inserirItenPrato = (iten, prato, acompanha = false) => {
      const pratoId = prato._id.toString();
      const pratoNome =
        (prato.grupo.multiplo ? `${prato.grupo.nome}\/` : '') + prato.nome;
      const _id = uuidv5(`${pratoId}-${acompanha}`, uuidv5.URL);

      const comedorId = iten.pedido.comedor._id.toString();

      const comedorIten: PedidoRelatorioComedorDto = {
        comedor: iten.pedido.comedor.nome,
        quantidade: iten.quantidade,
      };

      if (acompanha) {
        if (!comedorIten.de) comedorIten.de = [];
        comedorIten.de.push(iten.prato.nome);
      }

      if (!pratos.has(_id)) {
        const comedores = new Map<string, PedidoRelatorioComedorDto>();

        comedores.set(comedorId, comedorIten);

        const base = new PedidoRelatorioDto();
        base.prato = pratoNome;

        base.quantidade = iten.quantidade;
        base.comedoresMap = comedores;

        base['principal'] = !acompanha;

        pratos.set(_id, base);
      } else {
        const registro = pratos.get(_id);

        registro.quantidade += iten.quantidade;

        if (!registro.comedoresMap.has(comedorId)) {
          registro.comedoresMap.set(comedorId, comedorIten);
        } else {
          const comedorIten = registro.comedoresMap.get(comedorId);

          comedorIten.quantidade += iten.quantidade;

          if (acompanha) {
            if (!comedorIten.de) comedorIten.de = [];
            comedorIten.de.push(iten.prato.nome);
          }
        }
      }

      const ingredientes =
        prato?.ingredientes?.map((m: any) => {
          return {
            nome: m.nome,
          };
        }) || [];
      if (!pratoGeral.has(pratoId)) {
        pratoGeral.set(pratoId, {
          prato: pratoNome,
          quantidade: iten.quantidade,
          ingredientes: ingredientes,
        });
      } else {
        pratoGeral.get(pratoId).quantidade += iten.quantidade;
        pratoGeral.get(pratoId).ingredientes.concat(...ingredientes);
      }
    };

    return this.model
      .aggregate(aggregate(marmitaId))

      .then((itens) => {
        //console.log(JSON.stringify(itens, null, 4));

        itens.forEach((iten: any) => {
          inserirItenPrato(iten, iten.prato);

          if (iten.acompanhamentos && iten.acompanhamentos.length > 0) {
            iten.acompanhamentos.forEach((e: any) => {
              inserirItenPrato(iten, e, true);
            });
          }
        });

        const retornoPratos = [...pratos.values()]
          .map((m) => {
            return { ...m, comedores: m.comedores().sort(this.sortComedor) };
          })
          .sort(this.sortPrato)
          .sort(this.sortPrincipal)

          .map((m) => {
            delete m.comedoresMap;
            return m;
          });

        const retornoGeral = [...pratoGeral.values()].map((m) => {
          const ob = {
            prato: m.prato,
            quantidade: m.quantidade,
          };
          if (m.ingredientes && m.ingredientes.length > 0) {
            ob['ingredientes'] = m.ingredientes;
          }
          return ob;
        });

        return { pratos: retornoPratos, geral: retornoGeral };
      });
  }
}
