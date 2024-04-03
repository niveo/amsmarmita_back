import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ServicoInterface } from '../interfaces/servicos.interface';
import { Ingrediente } from '../schemas';
import { InsertIngredienteDto } from '../dtos/insert-ingrediente.dto';
import { UpdateIngredienteDto } from '../dtos/update-ingrediente.dto';

@Injectable()
export class IngredienteService implements ServicoInterface {
  constructor(
    @InjectModel(Ingrediente.name) private model: Model<Ingrediente>,
  ) {}

  async create(valueDto: InsertIngredienteDto): Promise<Ingrediente> {
    const createdCat = new this.model(valueDto);
    return createdCat.save();
  }

  async findById(id: string): Promise<Ingrediente> {
    return this.model.findById(id).exec();
  }

  async findAll(): Promise<Ingrediente[]> {
    return await this.model.find().exec();
  }

  async delete(id: string): Promise<boolean> {
    return (
      (await this.model.deleteOne({ _id: id.toObjectId() }).exec())
        .deletedCount > 0
    );
  }

  async update(id: string, valueDto: UpdateIngredienteDto): Promise<any> {
    return this.model
      .findByIdAndUpdate({ _id: id }, valueDto, { new: true })
      .exec();
  }
}
