import { Injectable } from '@nestjs/common';
import { ServicoInterface } from '../interfaces/servicos.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Prato } from '../schemas/prato.schema';
import { InsertPratoDto } from '../dtos/insert-prato.dto';
import { UpdatePratoDto } from '../dtos/update-prato.dto';
import { Model } from 'mongoose';
import { cloneMongoDocument } from '../common/utils';

@Injectable()
export class PratoService implements ServicoInterface {
  constructor(@InjectModel(Prato.name) private model: Model<Prato>) {}

  async create(valueDto: InsertPratoDto): Promise<Prato> {
    const createdCat = new this.model({
      nome: valueDto.nome,
      grupo: String(valueDto.grupoId).toObjectId(),
      composicoes: valueDto.composicoes,
      observacao: valueDto.observacao,
    });
    return createdCat.save();
  }

  async findById(id: string): Promise<Prato> {
    return this.model.findById(id).exec();
  }

  async findAll(): Promise<Prato[]> {
    return this.model.find().exec();
  }

  async delete(id: string): Promise<any> {
    return this.model.deleteOne({ _id: id }).exec();
  }

  async duplicar(id: any): Promise<any> {
    const clone = await this.model.findById(id).exec();
    const createdCat = new this.model(cloneMongoDocument(clone));
    return createdCat.save();
  }

  async update(id: string, valueDto: UpdatePratoDto): Promise<any> {
    return this.model
      .findByIdAndUpdate(
        { _id: id },
        {
          nome: valueDto.nome,
          grupo: String(valueDto.grupoId).toObjectId(),
          composicoes: valueDto.composicoes,
          observacao: valueDto.observacao,
        },
      )
      .exec();
  }
}
