import { Injectable } from '@nestjs/common';
import PDFKit from 'pdfkit';
import { createWriteStream } from 'fs';
import { join } from 'path';
import { v4 } from 'uuid';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  createPdf() {
    const fileName = v4() + '.pdf';
    const pd = new PDFKit();
    pd.fontSize(13).fillColor('#6155a4').text('Texto formatado', {
      align: 'center',
    });

    pd.fontSize(16).fillColor('#6155a4').text('Texto formatado', {
      align: 'center',
    });

    pd.fontSize(20).fillColor('#6155a4').text('Texto formatado', {
      align: 'center',
    });
    pd.pipe(createWriteStream(fileName));
    pd.end();

    return join(process.cwd(), fileName);
  }
}
