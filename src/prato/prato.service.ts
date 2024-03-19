import { Injectable } from '@nestjs/common';
import { ServicoInterface } from '../interfaces/servicos.interface';
import { InsertPratoDto } from '../dtos/insert-prato.dto';
import { UpdatePratoDto } from '../dtos/update-prato.dto';
import { PrismaService } from '../services/prisma.service';
import { Prato } from '@prisma/client';

@Injectable()
export class PratoService implements ServicoInterface {
  constructor(private readonly prisma: PrismaService) {}

  async create(valueDto: InsertPratoDto): Promise<Prato> {
    throw new Error('Method not implemented.');
  }

  async findById(id: string): Promise<Prato> {
    throw new Error('Method not implemented.');
  }

  async findAll(): Promise<Prato[]> {
    throw new Error('Method not implemented.');
  }

  async delete(id: string): Promise<any> {
    throw new Error('Method not implemented.');
  }

  async duplicar(id: any): Promise<any> {
    throw new Error('Method not implemented.');
  }

  async update(id: string, valueDto: UpdatePratoDto): Promise<any> {
    throw new Error('Method not implemented.');
  }

  async deletePratoId(id: string) {
    throw new Error('Method not implemented.');
  }
}
