import { Injectable } from '@nestjs/common';
import * as PDFKit from 'pdfkit';
import { createWriteStream } from 'fs';
import { join } from 'path';
import { v4 } from 'uuid';
import * as os from 'os';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  createPdf() {
    const fileName = v4() + '.pdf';
    console.log(PDFKit);

    const mostrarAcompnhamento = true;

    const pd = new PDFKit({
      size: "A4",
      margins: {
        bottom: 20,
        left: 20,
        right: 20,
        top: 20,
      },
    });
  
    const registros = [];
  
    registros.forEach((registro) => {
      pd.fontSize(12)
        .text(registro.quantidade.toString().padEnd(3, " "), {
          continued: true,
          stroke: true,
        })
        .text(registro.prato, {
          underline: true,
          stroke: false,
          continued: false,
        });
  
      const sb = registro.comedores.filter((f) => f.de.length == 0);
      const sa = registro.comedores
        .filter((f) => f.de.length > 0)
        .sort((a, b) =>
          a.de.length < b.de.length ? -1 : a.de.length > b.de.length ? 1 : 0
        );
  
      pd.fontSize(9);
      pd.text(
        sb.map((m) => `${m.quantidade} - ${m.comedor}`.padEnd(25, " ")).join(" ")
      );
  
      sa.forEach((comedor, index) => {
        const acompnhamentos = comedor.de.map((m) => {
          return {
            nome: `${m.grupo.multiplo ? m.grupo.nome + "/" : ""}${m.nome}`,
            principal: m.principal,
          };
        });
  
        pd.text(comedor.quantidade.toString().padEnd(2) + " - ", {
          continued: true,
        }).text(comedor.comedor.padEnd(25, " "), {
          continued: true,
        });
  
        if (mostrarAcompnhamento) {
          pd.text("[ ", { continued: true });
  
          let linhaInicial = false;
  
          acompnhamentos.forEach((acomp) => {
            if (linhaInicial) {
              pd.text(linhaInicial ? ", " : "", {
                continued: true,
                underline: false,
              });
            }
            if (acomp.principal) pd.text("*", { continued: true });
            pd.text(acomp.nome, { continued: true, oblique: acomp.principal });
            if (acomp.principal)
              pd.text("*", { continued: true, oblique: false });
            linhaInicial = true;
          });
  
          pd.text(" ]", {
            continued: true,
          });
        }
  
        pd.text("  ", {
          continued: false,
        });
      });
  
      pd.text("", { continued: false });
    });
  

    pd.pipe(createWriteStream(join(os.tmpdir(), fileName)));
    pd.end();

    return join(os.tmpdir(), fileName);
  }
}
