import { Injectable } from '@nestjs/common';
import { ServicoInterface } from '../interfaces/servicos.interface';
import { InjectModel } from '@nestjs/mongoose';
import { InsertPratoDto } from '../dtos/insert-prato.dto';
import { UpdatePratoDto } from '../dtos/update-prato.dto';
import { ClientSession, Model } from 'mongoose';
import { cloneMongoDocument } from '../common/utils';
import { Prato } from './prato.schema';

@Injectable()
export class PratoService implements ServicoInterface {
  constructor(@InjectModel(Prato.name) private model: Model<Prato>) {}

  async create(valueDto: InsertPratoDto): Promise<Prato> {
    const data: any = {
      ...valueDto,
      grupo: valueDto.grupo.toObjectId(),
    };
    const createdCat = new this.model(data);
    return createdCat.save();
  }

  async findById(id: string): Promise<Prato> {
    return this.model.findById(id).exec();
  }

  async findAll(): Promise<Prato[]> {
    return this.model.find().exec();
  }

  async delete(id: string): Promise<boolean> {
    return (await this.model.deleteOne({ _id: id.toObjectId() }).exec())
      .deletedCount > 0;
  }

  async duplicar(id: any): Promise<any> {
    const clone = await this.model.findById(id).exec();
    const createdCat = new this.model(cloneMongoDocument(clone));
    return createdCat.save();
  }

  async update(id: string, valueDto: UpdatePratoDto): Promise<any> {
    return this.model.findByIdAndUpdate({ _id: id.toObjectId() }, valueDto, {
      new: true,
    });
  }

  async deletePratoId(id: string, transactionSession: ClientSession) {
    const where = { grupo: id.toObjectId() };
    const conta = await this.model
      .where(where)
      .countDocuments()
      .session(transactionSession)
      .exec();
    if (conta === 0) {
      console.info('Não existe pratos vinculados a esse filtro', where);
      return true;
    }
    return (
      (await this.model.deleteOne(where).session(transactionSession).exec())
        .deletedCount > 0
    );
  }
}
