import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ServicoInterface } from '../interfaces/servicos.interface';
import { Grupo } from '../schemas/grupo.schema';
import { InsertGrupoDto } from '../dtos/insert-grupo.dto';
import { UpdateGrupoDto } from '../dtos/update-grupo.dto';

@Injectable()
export class GrupoService implements ServicoInterface {
  constructor(@InjectModel(Grupo.name) private model: Model<Grupo>) {}

  async create(valueDto: InsertGrupoDto): Promise<Grupo> {
    const createdCat = new this.model(valueDto);
    return createdCat.save();
  }

  async findById(id: string): Promise<Grupo> {
    return this.model.findById(id).exec();
  }

  async findAll(): Promise<Grupo[]> {
    return this.model.find().sort({ principal: 'desc', nome: 'asc' }).exec();
  }

  async delete(id: string): Promise<any> {
    return (await this.model.deleteOne({ _id: id }).exec()).deletedCount;
  }

  async update(id: string, valueDto: UpdateGrupoDto): Promise<any> {
    return this.model
      .findByIdAndUpdate({ _id: id }, valueDto, { new: true })
      .exec();
  }
}
