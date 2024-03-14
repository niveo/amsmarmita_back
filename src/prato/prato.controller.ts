import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common'; 
import { InsertPratoDto } from '../dtos/insert-prato.dto';
import { UpdatePratoDto } from '../dtos/update-prato.dto';
import { PratoService } from './prato.service';

@Controller({
  path: 'pratos',
})
export class PratoController {
  constructor(private readonly service: PratoService) {}

  @Get('duplicar')
  duplicar(@Query('id') id: string) {
    return this.service.duplicar(id);
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
  update(@Param('id') id: string, @Body() valueDto: UpdatePratoDto) {
    return this.service.update(id, valueDto);
  }

  @Post()
  create(@Body() valueDto: InsertPratoDto) {
    return this.service.create(valueDto);
  }
}
