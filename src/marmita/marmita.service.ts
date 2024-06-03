import mongoose, { Model } from 'mongoose';
import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { ServicoInterface } from '../interfaces/servicos.interface';
import { InsertMarmitaDto } from '../dtos/insert-marmita.dto';
import { UpdateMarmitaDto } from '../dtos/update-marmita.dto';
import { PedidoService } from '../pedido/pedido.service';
import { Marmita } from '../schemas';
import {
  differenceInDays,
  differenceInBusinessDays,
  endOfMonth,
  addMonths,
} from 'date-fns';

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
    const registros = await this.model
      .find({ lancamento: { $lt: endOfMonth(addMonths(new Date(), 1)) } })
      .sort({ lancamento: -1 })
      //https://mongoosejs.com/docs/tutorials/lean.html
      //lean retorna apenas o POJO do objeto
      .lean()
      .limit(5)
      .exec();
    return registros.map((marmita: any, index: number) => {
      const m = Object.assign(new Marmita(), marmita);

      const anterior = registros[index + 1];
      if (anterior) {
        const last = marmita.lancamento;
        const first = anterior.lancamento;

        const businessDays = differenceInBusinessDays(last, first);
        const inDays = differenceInDays(last, first);

        m['diasUteis'] = businessDays;
        m['diasCorridos'] = inDays;
      }

      return m;
    });
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
