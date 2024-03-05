import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { MarmitaService } from '../services/marmita.service';
import { InsertMarmitaDto } from '../dtos/insert-marmita.dto';
import { UpdateMarmitaDto } from '../dtos/update-marmita.dto';

@Controller({
  path: 'marmitas',
})
export class MarmitasController {
  constructor(private readonly service: MarmitaService) {}

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