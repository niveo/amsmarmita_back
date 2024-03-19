import { Injectable } from '@nestjs/common';
import { UpdateComerdoresDto } from '../dtos/update-comedores.dto';
import { InsertComerdoresDto } from '../dtos/insert-comedores.dto';
import { ServicoInterface } from '../interfaces/servicos.interface';
import { Comedor } from '@prisma/client';
import { PrismaService } from './prisma.service';

@Injectable()
export class ComedorService implements ServicoInterface {
  constructor(private readonly prisma: PrismaService) {}

  async create(valueDto: InsertComerdoresDto): Promise<Comedor> {
    return this.prisma.comedor.create({ data: valueDto });
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

  async update(id: string, valueDto: UpdateComerdoresDto): Promise<any> {
    return this.prisma.comedor.update({
      where: { id: id },
      data: valueDto,
    });
  }
}
