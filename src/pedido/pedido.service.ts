import { Injectable } from '@nestjs/common';
import { ServicoInterface } from '../interfaces/servicos.interface';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { ClientSession, Connection, Model } from 'mongoose';
import { Pedido } from './pedido.schema';
import { PedidoPratoService } from './pedido-prato.service';
import { PedidoPrato } from './pedido-prato.schema';

@Injectable()
export class PedidoService implements ServicoInterface {
  constructor(
    @InjectModel(Pedido.name) private model: Model<Pedido>,
    private readonly pedidoPratoService: PedidoPratoService,
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

  async carregarPedidoPratos(
    marmitaId: string,
    comedorId: string,
  ): Promise<{ pedido: Pedido; pratos: PedidoPrato[] }> {
    const registro = await this.model
      .findOne({
        marmita: marmitaId.toObjectId(),
        comedor: comedorId.toObjectId(),
      })
      .select(['comedor', 'marmita', '_id'])
      .exec();

    const pratos = await this.pedidoPratoService.carregarPedidoPratos(
      registro._id.toString(),
    );

    return { pedido: registro, pratos: pratos };
  }

  async delete(id: string): Promise<boolean> {
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      this.pedidoPratoService.deletePedidoId(id, session);

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

  async deleteMarmitaId(id: string, session: ClientSession): Promise<any> {
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
