import { Injectable } from '@nestjs/common';
import { ServicoInterface } from '../interfaces/servicos.interface';
import { Comedor, Prisma } from '@prisma/client';
import { PrismaService } from './prisma.service';

@Injectable()
export class ComedorService implements ServicoInterface {
  constructor(private readonly prisma: PrismaService) { }

  async create(data: Prisma.ComedorCreateInput): Promise<Comedor> {
    return this.prisma.comedor.create({ data });
  }

  async findById(id: string): Promise<Comedor> {
    return this.prisma.comedor.findUnique({
      where: { id: id },
    });
  }

  async findAll(): Promise<Comedor[]> {
    return this.prisma.comedor.findMany();
  }

  async delete(id: string): Promise<any> {
    return this.prisma.comedor.delete({
      where: { id: id },
    });
  }

  async update(id: string, data: Prisma.ComedorUpdateInput): Promise<any> {
    return this.prisma.comedor.update({
      where: { id: id },
      data,
    });
  }
}
