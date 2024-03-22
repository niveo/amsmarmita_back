import { Injectable } from '@nestjs/common';
import { ServicoInterface } from '../interfaces/servicos.interface';
import { PrismaService } from '../services/prisma.service';
import { Prato, Prisma } from '@prisma/client';

@Injectable()
export class PratoService implements ServicoInterface {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.PratoCreateInput): Promise<Prato> {
    return this.prisma.prato.create({ data: data });
  }

  async findById(id: string): Promise<Prato> {
    return this.prisma.prato.findUnique({
      where: {
        id: id,
      },
    });
  }

  async findAll(): Promise<Prato[]> {
    return this.prisma.prato.findMany();
  }

  async delete(id: string): Promise<any> {
    return this.prisma.prato.delete({
      where: { id: id },
    });
  }

  async duplicar(id: any): Promise<any> {
    throw new Error('Method not implemented.');
  }

  async update(id: string, data: Prisma.PratoUpdateInput): Promise<any> {
    return this.prisma.prato.update({
      data: data,
      where: {
        id: id,
      },
    });
  }

  async deletePratoId(id: string) {
    throw new Error('Method not implemented.');
  }
}
