import { Injectable } from '@nestjs/common';
import { ServicoInterface } from '../interfaces/servicos.interface';
import { InsertMarmitaDto } from '../dtos/insert-marmita.dto';
import { UpdateMarmitaDto } from '../dtos/update-marmita.dto';
import { Prisma, Marmita } from '@prisma/client';
import { PrismaService } from '../services/prisma.service';

@Injectable()
export class MarmitaService implements ServicoInterface {
  constructor(private readonly prisma: PrismaService) {}

  async create(valueDto: InsertMarmitaDto): Promise<Marmita> {
    throw new Error('Method not implemented.');
  }

  async findById(id: string): Promise<Marmita> {
    throw new Error('Method not implemented.');
  }

  async findAll(): Promise<Marmita[]> {
    throw new Error('Method not implemented.');
  }

  async delete(id: string): Promise<any> {
    throw new Error('Method not implemented.');
  }

  async update(id: string, valueDto: UpdateMarmitaDto): Promise<any> {
    throw new Error('Method not implemented.');
  }

  async carregarPedidoComedor(marmitaId: string, comedorId: string) {
    throw new Error('Method not implemented.');
    //   const ret = (await this.model.findOne({
    //     _id: marmitaId.toObjectId()
    //   }).populate({
    //     path: 'pedidos', match: {
    //       comedor: comedorId.toObjectId()
    //     },
    //     populate: {
    //       path: 'pratos',
    //       select: 'quantidade',
    //       populate: {
    //         path: 'prato',
    //         select: 'grupo'
    //       }
    //     }
    //   }).exec())?.pedidos[0];
    //   console.log(JSON.stringify(ret))
    //   return ret;
    //
  }
}
