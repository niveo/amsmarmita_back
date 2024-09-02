import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Parametros } from '../schemas';

@Injectable()
export class ParametroService {
    constructor(@InjectModel(Parametros.name) private model: Model<Parametros>) { }


    async findByChave(chave: string): Promise<Parametros> {
        return this.model.findOne({chave: chave}).exec();
    }

}
