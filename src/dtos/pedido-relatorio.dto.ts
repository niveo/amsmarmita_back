import { TipoMedida } from "../enuns/tipomedida.enum";

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
  medida: TipoMedida;
  quantidadeMedida: number;
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
