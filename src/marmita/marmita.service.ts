import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ServicoInterface } from '../interfaces/servicos.interface';
import { Marmita } from '../schemas/marmita.schema';
import { InsertMarmitaDto } from '../dtos/insert-marmita.dto';
import { UpdateMarmitaDto } from '../dtos/update-marmita.dto';

@Injectable()
export class MarmitaService implements ServicoInterface {
  constructor(@InjectModel(Marmita.name) private model: Model<Marmita>) { }

  async create(valueDto: InsertMarmitaDto): Promise<Marmita> {
    const createdCat = new this.model(valueDto);
    return createdCat.save();
  }

  async findById(id: string): Promise<Marmita> {
    return this.model.findById(id).exec();
  }

  async findAll(): Promise<Marmita[]> {
    return this.model.find().exec();
  }

  async delete(id: string): Promise<any> {
    return (await this.model.deleteOne({ _id: id }).exec()).deletedCount;
  }

  async update(id: string, valueDto: UpdateMarmitaDto): Promise<any> {
    return this.model
      .findByIdAndUpdate({ _id: id }, valueDto, { new: true })
      .exec();
  }

  async carregarPedidoComedor(marmitaId: string, comedorId: string) {
    const ret = (await this.model.findOne({
      _id: marmitaId.toObjectId()
    }).populate({
      path: 'pedidos', match: {
        comedor: comedorId.toObjectId()
      },
      populate: {
        path: 'pratos',
        select: 'quantidade',
        populate: {
          path: 'prato',
          select: 'grupo'
        }
      }
    }).exec())?.pedidos[0];
    console.log(JSON.stringify(ret))
    return ret;
  }

}
