import { Injectable } from '@nestjs/common';
import { Grupo as GrupoModel, Prisma } from '@prisma/client';
import { ServicoInterface } from '../interfaces/servicos.interface';
import { PrismaService } from './prisma.service';

@Injectable()
export class GrupoService implements ServicoInterface {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.GrupoCreateInput): Promise<GrupoModel> {
    return this.prisma.grupo.create({
      data,
    });
  }

  async findById(id: string): Promise<GrupoModel> {
    return this.prisma.grupo.findUnique({
      where: {
        id: id,
      },
    });
  }

  async findAll(): Promise<GrupoModel[]> {
    return this.prisma.grupo.findMany({
      orderBy: [{ principal: 'desc' }, { nome: 'asc' }],
    });
  }

  async delete(id: string): Promise<GrupoModel> {
    return this.prisma.grupo.delete({
      where: { id: id },
    });
  }

  async update(id: string, data: Prisma.GrupoUpdateInput): Promise<GrupoModel> {
    return this.prisma.grupo.update({
      data: data,
      where: {
        id: id,
      },
    });
  }
}
