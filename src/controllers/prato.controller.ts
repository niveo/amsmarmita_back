import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { PratoService } from '../services/prato.service';
import { InsertPratoDto } from '../dtos/insert-prato.dto';
import { UpdatePratoDto } from '../dtos/update-prato.dto';

@Controller({
  path: 'pratos',
})
export class PratoController {
  constructor(private readonly service: PratoService) {}

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
  update(@Param('id') id: string, @Body() valueDto: InsertPratoDto) {
    return this.service.update(id, valueDto);
  }

  @Post()
  create(@Body() valueDto: UpdatePratoDto) {
    return this.service.create(valueDto);
  }
}
