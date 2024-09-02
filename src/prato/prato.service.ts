import { Injectable } from '@nestjs/common';
import { ServicoInterface } from '../interfaces/servicos.interface';
import { InjectModel } from '@nestjs/mongoose';
import { InsertPratoDto } from '../dtos/insert-prato.dto';
import { UpdatePratoDto } from '../dtos/update-prato.dto';
import { ClientSession, Model } from 'mongoose';
import { cloneMongoDocument, isEmptyStr } from '../common/utils';
import { Prato } from '../schemas/prato.schema';

const POPULATE = [
  {
    path: 'grupo'
  }, {
    path: 'pratoIngredientes',
    populate: {
      path: 'ingrediente',
    }
  }
]

@Injectable()
export class PratoService implements ServicoInterface {


  constructor(@InjectModel(Prato.name) private model: Model<Prato>) {
  }

  async create(valueDto: InsertPratoDto): Promise<Prato> {
    const pratoIngredientes = await this.registrarPratoIngrediente(valueDto.pratoIngredientes);
    const data: any = {
      ...valueDto,
      grupo: valueDto.grupo.toObjectId(),
      pratoIngredientes: pratoIngredientes,
    };
    const createdCat = new this.model(data);
    return (await createdCat.save()).populate(POPULATE);
  }

  async findById(id: string): Promise<Prato> {
    return this.model.findById(id).populate(POPULATE).exec();
  }


  async findAll(): Promise<Prato[]> {
    return this.model.find().populate(POPULATE).exec();
  }

  async delete(id: string): Promise<boolean> {
    return (
      (await this.model.deleteOne({ _id: id.toObjectId() }).exec())
        .deletedCount > 0
    );
  }

  async duplicar(id: any): Promise<any> {
    const clone = await this.model.findById(id).exec();
    const createdCat = new this.model(cloneMongoDocument(clone));
    return createdCat.save();
  }

  async registrarPratoIngrediente(registros: any[]): Promise<any[]> {
    return registros?.map((m) => {
      return {
        quantidade: m.quantidade,
        medida: m.medida,
        ingrediente: m.ingrediente._id.toObjectId()
      }
    })
  }

  async update(id: string, valueDto: UpdatePratoDto): Promise<any> {
    const pratoIngredientes = await this.registrarPratoIngrediente(valueDto.pratoIngredientes);
    return this.model
      .findByIdAndUpdate(
        { _id: id.toObjectId() },
        {
          ...valueDto,
          grupo: valueDto.grupo.toObjectId(),
          pratoIngredientes: pratoIngredientes,
        },
        {
          new: true,
        },
      )
      .populate(POPULATE);
  }

  /**
   *
   * @param grupoId
   * @param transactionSession
   * @returns
   * Remove todos os pratos vinculados com o grupo
   */
  async removerPratosGrupoId(
    grupoId: string,
    transactionSession: ClientSession,
  ) {
    const where = { grupo: grupoId.toObjectId() };
    const conta = await this.model
      .where(where)
      .countDocuments()
      .session(transactionSession)
      .exec();
    if (conta === 0) {
      console.info('Não existe pratos vinculados a esse filtro', where);
      return true;
    }
    return (
      (await this.model.deleteOne(where).session(transactionSession).exec())
        .deletedCount > 0
    );
  }
}
