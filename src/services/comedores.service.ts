import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Comedores } from 'src/schemas/comedores.schema';
import { UpdateComerdoresDto } from 'src/dtos/update-comedores.dto';
import { InsertComerdoresDto } from 'src/dtos/insert-comedores.dto';

@Injectable()
export class ComedoresService {
  constructor(
    @InjectModel(Comedores.name) private ComedoresModel: Model<Comedores>,
  ) {}

  async create(insertComerdoresDto: InsertComerdoresDto): Promise<Comedores> {
    const createdCat = new this.ComedoresModel(insertComerdoresDto);
    return createdCat.save();
  }

  async findById(id: string): Promise<Comedores> {
    return this.ComedoresModel.findById(id).exec();
  }

  async findAll(): Promise<Comedores[]> {
    return this.ComedoresModel.find().exec();
  }

  async delete(id: string): Promise<any> {
    return this.ComedoresModel.deleteOne({ _id: id }).exec();
  }

  async update(
    id: string,
    updateComerdoresDto: UpdateComerdoresDto,
  ): Promise<any> {
    return this.ComedoresModel.findByIdAndUpdate(
      { _id: id },
      updateComerdoresDto,
    ).exec();
  }
}
