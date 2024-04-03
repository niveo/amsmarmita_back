import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { IngredienteService } from '../services/ingrediente.service';
import { UpdateIngredienteDto } from '../dtos/update-ingrediente.dto';
import { InsertIngredienteDto } from '../dtos/insert-ingrediente.dto';

@Controller({
  path: 'ingredientes',
})
export class IngredienteController {
  constructor(private readonly service: IngredienteService) {}

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
  update(@Param('id') id: string, @Body() valueDto: UpdateIngredienteDto) {
    return this.service.update(id, valueDto);
  }

  @Post()
  create(@Body() valueDto: InsertIngredienteDto) {
    return this.service.create(valueDto);
  }
}
