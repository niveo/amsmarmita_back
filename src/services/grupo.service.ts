import mongoose, { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { ServicoInterface } from '../interfaces/servicos.interface';
import { Grupo } from '../schemas/grupo.schema';
import { InsertGrupoDto } from '../dtos/insert-grupo.dto';
import { UpdateGrupoDto } from '../dtos/update-grupo.dto';
import { PratoService } from '../prato/prato.service';

@Injectable()
export class GrupoService implements ServicoInterface {
  constructor(
    @InjectModel(Grupo.name) private model: Model<Grupo>,
    private readonly pratoService: PratoService,
    @InjectConnection() private readonly connection: mongoose.Connection,
  ) {}

  async create(valueDto: InsertGrupoDto): Promise<Grupo> {
    const createdCat = new this.model(valueDto);
    return createdCat.save();
  }

  async findById(id: string): Promise<Grupo> {
    return this.model.findById(id.toObjectId()).exec();
  }

  async findAll(): Promise<Grupo[]> {
    return this.model.find().sort({ principal: 'desc', nome: 'asc' }).exec();
  }

  async delete(id: string): Promise<boolean> {
    const transactionSession = await this.connection.startSession();
    transactionSession.startTransaction();

    try {
      if (
        await this.pratoService.removerPratosGrupoId(id, transactionSession)
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
        throw 'Não foi possivel remover pratos vinculados a esse grupo';
      }
    } catch (e) {
      console.info('Abortando transação');
      await transactionSession.abortTransaction();
      throw e;
    } finally {
      transactionSession.endSession();
    }
  }

  async update(id: string, valueDto: UpdateGrupoDto): Promise<Grupo> {
    return this.model
      .findByIdAndUpdate({ _id: id.toObjectId() }, valueDto, { new: true })
      .exec();
  }
}
