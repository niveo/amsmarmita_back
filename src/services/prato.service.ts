import { Injectable } from '@nestjs/common';
import { ServicoInterface } from '../interfaces/servicos.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Pratos } from '../schemas/pratos.schema';
import { InsertPratoDto } from '../dtos/insert-prato.dto';
import { UpdatePratoDto } from '../dtos/update-prato.dto';
import { Model } from 'mongoose';

@Injectable()
export class PratoService implements ServicoInterface {
  constructor(@InjectModel(Pratos.name) private model: Model<Pratos>) {}

  async create(valueDto: InsertPratoDto): Promise<Pratos> {
    const createdCat = new this.model({
      nome: valueDto.nome,
      grupo: String(valueDto.grupoId).toObjectId(),
      composicoes: valueDto.composicoes,
      observacao: valueDto.observacao,
    });
    return createdCat.save();
  }

  async findById(id: string): Promise<Pratos> {
    return this.model.findById(id).exec();
  }

  async findAll(): Promise<Pratos[]> {
    return this.model.find().exec();
  }

  async delete(id: string): Promise<any> {
    return this.model.deleteOne({ _id: id }).exec();
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
