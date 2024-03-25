import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { ServicoInterface } from '../interfaces/servicos.interface';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { ClientSession, Connection, Model } from 'mongoose';
import { Pedido } from './pedido.schema';
import { MarmitaService } from '../marmita/marmita.service';
import { PedidoPratoService } from './pedido-prato.service';

@Injectable()
export class PedidoService implements ServicoInterface {
  constructor(
    @InjectModel(Pedido.name) private model: Model<Pedido>,
    @Inject(forwardRef(() => MarmitaService))
    private readonly marmitaService: MarmitaService,
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

  async findByMamitaId(marmitaId: string, comedorId: string) {
    return this.marmitaService.carregarPedidoComedor(marmitaId, comedorId);
  }

  async delete(id: string): Promise<any> {
    return (await this.model.deleteOne({ _id: id }).exec()).deletedCount;
  }

  async update(id: string, valueDto: any): Promise<any> {
    return this.model.findByIdAndUpdate({ _id: id }, {}).exec();
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

  async deletePratoId(pedidoId: string, pratoId: string) {
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      this.pedidoPratoService.deletePrato(pratoId, session);
      const pedido = await this.findById(pedidoId);
      const index = pedido.pratos.findIndex((p) => p._id);
      delete pedido.pratos[index];

      await this.model.updateOne(
        { _id: pedidoId.toObjectId() },
        { pratos: pedido.pratos },
      );
    } catch (e) {
      session.abortTransaction();
    } finally {
      session.endSession();
    }
  }
}
