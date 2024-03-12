import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ServicoInterface } from '../interfaces/servicos.interface';
import { Marmita } from '../schemas/marmita.schema';
import { InsertMarmitaDto } from '../dtos/insert-marmita.dto';
import { UpdateMarmitaDto } from '../dtos/update-marmita.dto';

/* this.model
      .findById('65e9adac9ffe0d8c78fe089e'.toObjectId())
      .populate('pedidos', null, Pedido.name)
      .exec()
      .then((ret) => {
        console.log(ret);
      }); */

@Injectable()
export class MarmitaService implements ServicoInterface {
  constructor(@InjectModel(Marmita.name) private model: Model<Marmita>) {
     this.create({
      lancamento: new Date(),
      observacao: 'T1',
    }).then((ret) => { 
      this.delete(ret._id.toString()).then();
    });

    /*  
    this.create({
      lancamento: new Date(),
      observacao: 'T2',
    }).then(); */

   /*  this.model
      .deleteMany({
        _id: {
          $in: [
            '65f0ad886c57d728ce69025a',
            '65f0b6a802336aa95b8ff4fa',
            '65f0be50eca2c55f3587057e',
          ],
        },
      })
      .exec(); */
  }

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
    return this.model.deleteOne({ _id: id }).exec();
  }

  async update(id: string, valueDto: UpdateMarmitaDto): Promise<any> {
    return this.model.findByIdAndUpdate({ _id: id }, valueDto).exec();
  }
}
