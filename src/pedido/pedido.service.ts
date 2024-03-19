import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { ServicoInterface } from '../interfaces/servicos.interface';
import { MarmitaService } from '../marmita/marmita.service';
import { PedidoPratoService } from './pedido-prato.service';
import { PrismaService } from 'src/services/prisma.service';
import { Pedido } from '@prisma/client';

@Injectable()
export class PedidoService implements ServicoInterface {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(forwardRef(() => MarmitaService))
    private readonly marmitaService: MarmitaService,
    private readonly pedidoPratoService: PedidoPratoService,
  ) {}

  async create(valueDto: any) {
    throw new Error('Method not implemented.');
  }

  async findById(id: string) {
    throw new Error('Method not implemented.');
  }

  async findAll(): Promise<Pedido[]> {
    throw new Error('Method not implemented.');
  }

  async findByMamitaId(marmitaId: string, comedorId: string) {
    return this.marmitaService.carregarPedidoComedor(marmitaId, comedorId);
  }

  async delete(id: string): Promise<Pedido> {
    throw new Error('Method not implemented.');
  }

  async update(id: string, valueDto: any): Promise<Pedido> {
    throw new Error('Method not implemented.');
  }

  async deleteMarmitaId(id: string): Promise<any> {
    throw new Error('Method not implemented.');
  }

  async deletePratoId(pedidoId: string, pratoId: string) {
    throw new Error('Method not implemented.');
  }
}
