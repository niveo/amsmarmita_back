export class PedidoRelatorioDto {
  prato: string;
  principal: boolean;
  quantidade: number;
  grupo: {
    nome: string;
    multiplo: boolean;
    principal: boolean;
    somarRelatorio: boolean;
  };
  comedoresMap?: Map<string, PedidoRelatorioComedorDto>;
  comedores(): PedidoRelatorioComedorDto[] {
    return [...this.comedoresMap.values()];
  }
}

export class PedidoRelatorioComedorDto {
  comedor: string;
  quantidade: number;
  de?: {
    nome: string;
    grupo: {
      nome: string;
      multiplo: boolean;
      principal: boolean;
      cor: string;
    };
  }[];

  acompanha?: string[];
}
