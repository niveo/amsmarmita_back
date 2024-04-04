export class PedidoRelatorioDto {
  prato: string;
  quantidade: number;
  comedoresMap?: Map<string, PedidoRelatorioComedorDto>;
  principal? = false;
  comedores(): PedidoRelatorioComedorDto[] {
    return [...this.comedoresMap.values()];
  }
}

export class PedidoRelatorioComedorDto {
  comedor: string;
  quantidade: number;
  de?: string[];
}
