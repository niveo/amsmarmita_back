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
import { Ingrediente, Prato } from '../schemas';

const unsetIngredientes = ['observacao', '__v'];
const unsetGrupo = [...unsetIngredientes, 'principal'];
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
    this.carregarRelatorio('660c717d90c39e1a134e9b39').then((ret) => {
      // console.log(JSON.stringify(ret.pratos, null, 4));
    });
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

  pratoNome = (prato: Prato) =>
    (prato.grupo.multiplo ? `${prato.grupo.nome}\/` : '') + prato.nome;

  carregarRelatorio(marmitaId: string): Promise<any> {
    const pratos = new Map<string, PedidoRelatorioDto>();

    const ingredientesMap = new Map<
      string,
      {
        nome: string;
        quantidade: number;
        pratos: Map<string, { nome: string; quantidade: number }>;
      }
    >();

    const inserirIngredientes = (
      f: Ingrediente,
      prato: Prato,
      iten: PedidoItem,
    ) => {
      const pratoId = prato._id.toString();
      const ingredienteId = f._id!.toString();
      if (!ingredientesMap.has(ingredienteId)) {
        const cr = new Map<string, { nome: string; quantidade: number }>();

        cr.set(prato._id.toString(), {
          nome: prato.nome,
          quantidade: iten.quantidade,
        });
        ingredientesMap.set(ingredienteId, {
          nome: f.nome,
          quantidade: iten.quantidade,
          pratos: cr,
        });
      } else {
        const ing = ingredientesMap.get(ingredienteId);
        ing.quantidade += iten.quantidade;

        if (!ing.pratos.has(pratoId)) {
          ing.pratos.set(pratoId, {
            nome: prato.nome,
            quantidade: iten.quantidade,
          });
        } else {
          const cpr = ing.pratos.get(pratoId);
          cpr.quantidade += iten.quantidade;
        }
      }
    };

    const inserirItenPrato = (iten: PedidoItem, prato: Prato) => {
      const pratoId = prato._id.toString();

      const _id = pratoId;

      const comedorId = iten.pedido.comedor._id.toString();

      const comedorIten: PedidoRelatorioComedorDto = {
        comedor: iten.pedido.comedor.nome,
        quantidade: iten.quantidade,
        de:
          iten.acompanhamentos.map((m) => {
            return {
              nome: m.nome,
              grupo: {
                nome: m.grupo.nome,
                multiplo: m.grupo.multiplo,
                cor: m.grupo.cor,
              },
            };
          }) || [],
      };

      if (!pratos.has(_id)) {
        const comedores = new Map<string, PedidoRelatorioComedorDto>();

        comedores.set(comedorId, comedorIten);

        const base = new PedidoRelatorioDto();
        base.prato = this.pratoNome(prato);

        base.quantidade = iten.quantidade;
        base.comedoresMap = comedores;

        pratos.set(_id, base);
      } else {
        const registro = pratos.get(_id);

        registro.quantidade += iten.quantidade;

        if (!registro.comedoresMap.has(comedorId)) {
          registro.comedoresMap.set(comedorId, comedorIten);
        } else {
          const comedorIten = registro.comedoresMap.get(comedorId);

          comedorIten.quantidade += iten.quantidade;
        }
      }

      prato?.ingredientes?.forEach((f: Ingrediente) => {
        inserirIngredientes(f, prato, iten);
      });

      iten.acompanhamentos.forEach((c: Prato) => {
        c?.ingredientes?.forEach((f: Ingrediente) => {
          inserirIngredientes(f, c, iten);
        });
      });
    };

    return this.model
      .aggregate(aggregate(marmitaId))

      .then((itens) => {
        //console.log(JSON.stringify(itens, null, 4));

        itens.forEach((iten: any) => {
          inserirItenPrato(iten, iten.prato);
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

        const retornoIngredientes = [...ingredientesMap.values()].map((m) => {
          const ob = {
            nome: m.nome,
            quantidade: m.quantidade,
          };
          ob['pratos'] = [...m.pratos.values()].map((mp) => mp);
          return ob;
        });

        return { pratos: retornoPratos, ingredientes: retornoIngredientes };
      });
  }
}
