import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
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
import { v5 as uuidv5 } from 'uuid';
import { PratoIngrediente } from '../schemas/prato-ingrediente.schema';

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
  sortNome = (a, b) => a.nome!.localeCompare(b.nome!);
  sortComedor = (a: PedidoRelatorioComedorDto, b: PedidoRelatorioComedorDto) =>
    a.comedor!.localeCompare(b.comedor!);

  constructor(
    @InjectModel(PedidoItem.name) private model: Model<PedidoItem>,
    @Inject(forwardRef(() => PedidoService))
    private readonly pedidoService: PedidoService,
  ) { }

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

  private async carregarRegistrosRelatorios(marmitaId: string) {
    const pedidos = await this.pedidoService.obterIdPedidosMarmitas(marmitaId);
    const populate = [
      {
        path: 'grupo',
      },
      {
        path: 'ingredientes'
      },
      {
        path: 'pratoIngredientes',
        populate: [
          {
            path: 'ingrediente',
          }
        ]
      }
    ]
    const ids = pedidos.map(m => m._id);
    return await this.model.find({ pedido: { $in: ids } }).populate([
      {
        path: 'pedido',
        populate: [
          {
            path: 'marmita',
          },
          {
            path: 'comedor',
          }
        ]
      },
      {
        path: 'prato',
        populate: [...populate]
      },
      {
        path: 'acompanhamentos',
        populate: [...populate]
      }
    ]).exec();
  }

  pratoNome = (prato: Prato) =>
    (prato.grupo.multiplo ? `${prato.grupo.nome}\/` : '') + prato.nome;

  carregarRelatorio(
    marmitaId: string,
  ): Promise<{ pratos: any[]; ingredientes: any[]; acompanhamentos: any[] }> {
    const pratos = new Map<string, PedidoRelatorioDto>();
    const comedoresTotal = new Map<
      string,
      { nome: string; quantidade: number }
    >();

    const ingredientesMap = new Map<
      string,
      {
        nome: string;
        quantidade: number;
        pratos: Map<string, { nome: string; quantidade: number }>;
      }
    >();

    const inserirIngredientes = (
      f: PratoIngrediente,
      prato: Prato,
      iten: PedidoItem,
    ) => {

      if (f.ingrediente == null) return

      const pratoId = prato._id.toString();
      const ingredienteId = f.ingrediente._id!.toString();
      if (!ingredientesMap.has(ingredienteId)) {
        const cr = new Map<string, { nome: string; quantidade: number }>();

          cr.set(prato._id.toString(), {
            nome: prato.nome,
            quantidade: iten.quantidade,
          });
        ingredientesMap.set(ingredienteId, {
          nome: f.ingrediente.nome,
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

    const inserirItenPrato = (
      iten: PedidoItem,
      prato: Prato,
      acompanha = false,
    ) => {
      const pratoId = prato._id.toString();

      const _id = uuidv5(`${pratoId}-${acompanha}`, uuidv5.URL);

      const comedorId = iten.pedido.comedor._id.toString();

      const comedorIten: PedidoRelatorioComedorDto = {
        comedor: iten.pedido.comedor.nome,
        quantidade: iten.quantidade,
        de:
          iten.acompanhamentos.map((m) => {
            return {
              nome: m.nome,
              principal: m.grupo.principal,
              grupo: {
                nome: m.grupo.nome,
                multiplo: m.grupo.multiplo,
                cor: m.grupo.cor,
                principal: m.grupo.principal,
              },
            };
          }) || [],
      };

      if (acompanha) {
        if (!comedorIten.acompanha) comedorIten.acompanha = [];
        comedorIten.acompanha.push(iten.prato.nome);
      }

      if (!pratos.has(_id)) {
        const comedores = new Map<string, PedidoRelatorioComedorDto>();

        comedores.set(comedorId, comedorIten);

        const base = new PedidoRelatorioDto();
        base.prato = this.pratoNome(prato);
        base.grupo = prato.grupo;

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
            if (!comedorIten.acompanha) comedorIten.acompanha = [];
            comedorIten.acompanha.push(iten.prato.nome);
          }
        }
      }
    };

    return this.carregarRegistrosRelatorios(marmitaId)
      .then((itens) => {
        //console.log(JSON.stringify(itens, null, 4));

        itens.forEach((iten: PedidoItem) => {
          if (
            iten.prato.grupo.principal &&
            !iten.prato.grupo.naoSomarRelatorioView
          ) {
            const com = iten.pedido.comedor;
            if (!comedoresTotal.has(com._id.toString())) {
              comedoresTotal.set(com._id.toString(), {
                nome: com.nome,
                quantidade: iten.quantidade,
              });
            } else {
              comedoresTotal.get(com._id.toString()).quantidade +=
                iten.quantidade;
            }
          }

          inserirItenPrato(iten, iten.prato);

          iten.prato?.pratoIngredientes?.forEach((f: PratoIngrediente) => {
            //Pode existir um Ingrediente sem vinculo nos docs de Ingredientes
            inserirIngredientes(f, iten.prato, iten);
          });

          if (iten.acompanhamentos && iten.acompanhamentos.length > 0) {
            iten.acompanhamentos.forEach((e: Prato) => {
              inserirItenPrato(iten, e, true);

              e?.pratoIngredientes?.forEach((f: PratoIngrediente) => {
                //Pode existir um Ingrediente sem vinculo nos docs de Ingredientes
                inserirIngredientes(f, e, iten);
              });
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

        const retornoIngredientes = [...ingredientesMap.values()]
          .map((m) => {
            const ob = {
              nome: m.nome,
              quantidade: m.quantidade,
            };
            ob['pratos'] = [...m.pratos.values()].map((mp) => mp);
            return ob;
          })
          .sort(this.sortNome);

        return {
          pratos: retornoPratos.filter((f) => f.principal),
          acompanhamentos: retornoPratos.filter((f) => !f.principal),
          ingredientes: retornoIngredientes,
          comedores: [...comedoresTotal.values()],
        };
      });
  }
}
