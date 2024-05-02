import { Controller, Get, Header, Query, StreamableFile } from '@nestjs/common';
import { RelatorioService } from '../services/relatorio.service';

@Controller({
  path: 'relatorios',
})
export class RelatorioController {
  constructor(private readonly relatorioService: RelatorioService) {}

  @Get('/relatorio')
  carregarRelatorioView(@Query('marmitaId') marmitaId: string) {
    return this.relatorioService.carregarRelatorioView(marmitaId);
  }

  @Get('/relatoriopdf')
  @Header('Content-Type', 'application/pdf')
  @Header('Content-Disposition', 'attachment; filename="marmitas.pdf"')
  async carregarRelatorioPdf(@Query('marmitaId') marmitaId: string) {
    try {
      const stream =
        await this.relatorioService.carregarRelatorioPdf(marmitaId);
      return new StreamableFile(stream);
    } finally {
      console.log('StreamableFile-finally');
    }
  }
}
