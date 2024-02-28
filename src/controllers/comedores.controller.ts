import { ComedoresService } from './../services/comedores.service';
import { Controller, Get } from '@nestjs/common';

@Controller({
  path: 'comedores',
})
export class ComedoresController {
  constructor(private readonly comedoresService: ComedoresService) {}

  @Get()
  getAll() {
    return this.comedoresService.findAll();
  }
}
