import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Comedor } from '../schemas/comedor.schema';
import { UpdateComerdoresDto } from '../dtos/update-comedores.dto';
import { InsertComerdoresDto } from '../dtos/insert-comedores.dto';
import { ServicoInterface } from '../interfaces/servicos.interface';

@Injectable()
export class ComedorService implements ServicoInterface {
  constructor(@InjectModel(Comedor.name) private model: Model<Comedor>) {}

  async create(valueDto: InsertComerdoresDto): Promise<Comedor> {
    const createdCat = new this.model(valueDto);
    return createdCat.save();
  }

  async findById(id: string): Promise<Comedor> {
    return this.model.findById(id).exec();
  }

  async findAll(): Promise<Comedor[]> {
    return this.model.find().exec();
  }

  async delete(id: string): Promise<any> {
    return this.model.deleteOne({ _id: id }).exec();
  }

  async update(id: string, valueDto: UpdateComerdoresDto): Promise<any> {
    return this.model.findByIdAndUpdate({ _id: id }, valueDto).exec();
  }
}
