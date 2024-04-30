import { Controller, Get, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';
import { createReadStream, rmSync } from 'fs';
import * as path from 'path';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/file')
  getFile(@Res() res: Response) {
    let file = null;
    try {
      file = this.appService.createPdf();

      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition':
          'attachment; filename="' + path.basename(file) + '"',
      });

      const stream = createReadStream(file);
      stream.pipe(res);

      stream.addListener('end', () => {
        if (file) rmSync(file);
      });
    } finally {
    }
  }
}
