import { Injectable } from '@nestjs/common';
import { ServicoInterface } from '../interfaces/servicos.interface';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { ClientSession, Connection, Model } from 'mongoose';
import { Pedido } from './pedido.schema';
import { PedidoItemService } from './pedido-item.service';
import { PedidoItem } from './pedido-item.schema';
import { ErroInternoException } from '../common/exceptions/errointerno.exception';

@Injectable()
export class PedidoService implements ServicoInterface {
  constructor(
    @InjectModel(Pedido.name) private model: Model<Pedido>,
    private readonly pedidoItemService: PedidoItemService,
    @InjectConnection() private connection: Connection,
  ) {}

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

  obterPedidoId(marmita: string, comedor: string): Promise<Pedido> {
    return this.model
      .findOne({
        marmita: marmita.toObjectId(),
        comedor: comedor.toObjectId(),
      })
      .exec();
  }

  async carregarItens(
    marmitaId: string,
    comedorId: string,
  ): Promise<{ pedido: Pedido; pratos: PedidoItem[] }> {
    const registro = await this.model
      .findOne({
        marmita: marmitaId.toObjectId(),
        comedor: comedorId.toObjectId(),
      })
      .select(['comedor', 'marmita', '_id'])
      .exec();

    if (!registro)
      throw new ErroInternoException('Não existe pedidos nessa marmita.');

    const pratos = (
      await this.pedidoItemService.carregarItens(registro._id.toString())
    )?.sort((a, b) => {
      if (a.prato.nome < b.prato.nome) return -1;
      if (a.prato.nome > b.prato.nome) return 1;
      return 0;
    });

    return { pedido: registro, pratos: pratos };
  }

  async delete(id: string): Promise<boolean> {
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      this.pedidoItemService.deletePedidoId(id, session);

      const deletedCount = (
        await this.model.deleteOne({ _id: id }).session(session).exec()
      ).deletedCount;

      session.commitTransaction();

      return deletedCount > 0;
    } catch (e) {
      session.abortTransaction();
    } finally {
      session.endSession();
    }
  }

  async update(id: string, valueDto: any): Promise<any> {
    return this.model
      .findByIdAndUpdate({ _id: id.toObjectId() }, valueDto, {
        new: true,
      })
      .exec();
  }

  /**
   * @param id
   * @param session
   * @returns
   * Remove todos os pedidos vinculados a marmita
   */
  async removerPedidosMarmitaId(
    id: string,
    session: ClientSession,
  ): Promise<any> {
    const where = { marmita: id.toObjectId() };
    const conta = await this.model
      .where(where)
      .countDocuments()
      .session(session)
      .exec();
    if (conta === 0) return true;
    return (
      (await this.model.deleteOne(where).session(session).exec()).deletedCount >
      0
    );
  }
}
