import mongoose, { Model } from 'mongoose';
import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { ServicoInterface } from '../interfaces/servicos.interface';
import { InsertMarmitaDto } from '../dtos/insert-marmita.dto';
import { UpdateMarmitaDto } from '../dtos/update-marmita.dto';
import { PedidoService } from '../pedido/pedido.service';
import { Marmita } from '../schemas';

@Injectable()
export class MarmitaService implements ServicoInterface {
  constructor(
    @InjectModel(Marmita.name) private model: Model<Marmita>,
    @Inject(forwardRef(() => PedidoService))
    private readonly pedidoService: PedidoService,
    @InjectConnection() private readonly connection: mongoose.Connection,
  ) {}

  async create(valueDto: InsertMarmitaDto): Promise<Marmita> {
    const createdCat = new this.model(valueDto);
    return createdCat.save();
  }

  async findById(id: string): Promise<Marmita> {
    return this.model.findById(id).exec();
  }

  async findAll(): Promise<Marmita[]> {
    return this.model.find().sort({ lancamento: -1 }).exec();
  }

  async delete(id: string): Promise<boolean> {
    const transactionSession = await this.connection.startSession();
    transactionSession.startTransaction();
    try {
      if (
        await this.pedidoService.removerPedidosMarmitaId(id, transactionSession)
      ) {
        const deletedCount = (
          await this.model
            .deleteOne({ _id: id.toObjectId() })
            .session(transactionSession)
            .exec()
        ).deletedCount;
        await transactionSession.commitTransaction();
        return deletedCount > 0;
      } else {
        throw 'Não foi possivel remover pedidos vinculados a essa marmita';
      }
    } catch (e) {
      console.info('Abortando transação');
      await transactionSession.abortTransaction();
      throw e;
    } finally {
      await transactionSession.endSession();
    }
  }

  async update(id: string, valueDto: UpdateMarmitaDto): Promise<Marmita> {
    return this.model
      .findByIdAndUpdate({ _id: id }, valueDto, { new: true })
      .exec();
  }
}
