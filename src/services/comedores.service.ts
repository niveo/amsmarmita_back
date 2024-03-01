import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Comedores } from '../schemas/comedores.schema';
import { UpdateComerdoresDto } from '../dtos/update-comedores.dto';
import { InsertComerdoresDto } from '../dtos/insert-comedores.dto';
import { ServicoInterface } from '../interfaces/servicos.interface';

@Injectable()
export class ComedoresService implements ServicoInterface {
  constructor(@InjectModel(Comedores.name) private model: Model<Comedores>) {}

  async create(valueDto: InsertComerdoresDto): Promise<Comedores> {
    const createdCat = new this.model(valueDto);
    return createdCat.save();
  }

  async findById(id: string): Promise<Comedores> {
    return this.model.findById(id).exec();
  }

  async findAll(): Promise<Comedores[]> {
    return this.model.find().exec();
  }

  async delete(id: string): Promise<any> {
    return this.model.deleteOne({ _id: id }).exec();
  }

  async update(id: string, valueDto: UpdateComerdoresDto): Promise<any> {
    return this.model.findByIdAndUpdate({ _id: id }, valueDto).exec();
  }
}
