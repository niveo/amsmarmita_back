import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { InsertMarmitaDto } from '../dtos/insert-marmita.dto';
import { UpdateMarmitaDto } from '../dtos/update-marmita.dto';
import { MarmitaService } from './marmita.service';
import { Marmita } from '../schemas';

@Controller({
  path: 'marmitas',
})
export class MarmitaController {
  constructor(private readonly service: MarmitaService) {}

  @Get('/listardatas')
  listarDatas(): Promise<Marmita[]> {
    return this.service.listarDatas();
  }

  @Get()
  getAll() {
    return this.service.findAll();
  }

  @Get(':id')
  getId(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.service.delete(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() valueDto: UpdateMarmitaDto) {
    return this.service.update(id, valueDto);
  }

  @Post()
  create(@Body() valueDto: InsertMarmitaDto) {
    return this.service.create(valueDto);
  }
}
