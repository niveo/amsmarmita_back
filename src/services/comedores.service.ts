import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Comedores } from 'src/schemas/comedores.schema';

@Injectable()
export class ComedoresService {
  constructor(
    @InjectModel(Comedores.name) private ComedoresModel: Model<Comedores>,
  ) {}

  async create(nome: string): Promise<Comedores> {
    const createdCat = new this.ComedoresModel({ nome: nome });
    return createdCat.save();
  }

  async findAll(): Promise<Comedores[]> {
    return this.ComedoresModel.find().exec();
  }
}
