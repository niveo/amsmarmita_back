import { Injectable } from '@nestjs/common';
import { PedidoItemService } from '../pedido/pedido-item.service';
import { ReadStream, createReadStream, createWriteStream, rmSync } from 'fs';
import { join } from 'path';
import * as os from 'os';

//import * as PDFKit from 'pdfkit';
/**
 * Vercel utiliza essa forma de import
 */
import PDFKit from 'pdfkit';
import { v4 } from 'uuid';

@Injectable()
export class RelatorioService {
  constructor(private readonly pedidoItemService: PedidoItemService) {}

  carregarRelatorioView(marmitaId: string) {
    return this.pedidoItemService.carregarRelatorio(marmitaId);
  }

  async carregarRelatorioPdf(marmitaId: string): Promise<ReadStream> {
    const fileName = `${v4()}.pdf`;

    const mostrarAcompnhamento = true;

    const pd = new PDFKit({
      size: 'A4',
      margins: {
        bottom: 20,
        left: 20,
        right: 20,
        top: 20,
      },
    });

    const registros = await this.carregarRelatorioView(marmitaId);

    const somatizarAcompanhamentos = registros.acompanhamentos
      .filter((f) => f.grupo.somarRelatorio)
      .map((m) => {
        return { prato: m.prato, quantidade: m.quantidade };
      });

    const somatizarPratos = registros.pratos
      .filter((f) => f.grupo.somarRelatorio)
      .map((m) => {
        return { prato: m.prato, quantidade: m.quantidade };
      });

    registros.pratos.forEach((registro) => {
      pd.fontSize(12)
        .text(registro.quantidade.toString().padEnd(3, ' '), {
          continued: true,
          stroke: true,
        })
        .text(registro.prato, {
          underline: true,
          stroke: false,
          continued: false,
        });

      const sb = registro.comedores.filter(
        (f: { de: any[] }) => f.de.length == 0,
      );
      const sa = registro.comedores
        .filter((f: { de: any[] }) => f.de.length > 0)
        .sort((a: { de: any[] }, b: { de: any[] }) =>
          a.de.length < b.de.length ? -1 : a.de.length > b.de.length ? 1 : 0,
        );

      pd.fontSize(9);
      pd.text(
        sb
          .map((m) => `${m.quantidade} - ${m.comedor}`.padEnd(25, ' '))
          .join(' '),
      );

      sa.forEach((comedor: any) => {
        const acompnhamentos = comedor.de.map((m) => {
          return {
            nome: `${m.grupo.multiplo ? m.grupo.nome + '/' : ''}${m.nome}`,
            principal: m.principal,
          };
        });

        pd.text(comedor.quantidade.toString().padEnd(2) + ' - ', {
          continued: true,
        }).text(comedor.comedor.padEnd(25, ' '), {
          continued: true,
        });

        if (mostrarAcompnhamento) {
          pd.text('[ ', { continued: true });

          let linhaInicial = false;

          acompnhamentos.forEach((acomp) => {
            if (linhaInicial) {
              pd.text(linhaInicial ? ', ' : '', {
                continued: true,
                underline: false,
              });
            }
            if (acomp.principal) pd.text('*', { continued: true });
            pd.text(acomp.nome, { continued: true, oblique: acomp.principal });
            if (acomp.principal)
              pd.text('*', { continued: true, oblique: false });
            linhaInicial = true;
          });

          pd.text(' ]', {
            continued: true,
          });
        }

        pd.text('  ', {
          continued: false,
        });
      });

      pd.text('', { continued: false });
    });

    const somatizar = [...somatizarAcompanhamentos, ...somatizarPratos];
    if (somatizar.length > 0) {
      pd.text('GR: ');
      somatizar.forEach((pr) => {
        pd.text(`${pr.prato}: ${pr.quantidade}`);
      });
    }

    const file = join(os.tmpdir(), fileName);
    const stream = pd.pipe(createWriteStream(file));
    pd.end();

    return new Promise<ReadStream>((rs, rj) => {
      stream.on('finish', () => {
        const rd = createReadStream(file);
        rd.on('end', () => {
          setTimeout(() => {
            rmSync(file);
          }, 1000);
        });
        rs(rd);
      });
      stream.on('error', (err) => {
        rj(err);
      });
    });
  }
}
