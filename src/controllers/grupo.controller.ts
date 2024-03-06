import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { GrupoService } from '../services/grupo.service';
import { InsertGrupoDto } from '../dtos/insert-grupo.dto';
import { UpdateGrupoDto } from '../dtos/update-grupo.dto';

@Controller({
  path: 'grupos',
})
export class GrupoController {
  constructor(private readonly service: GrupoService) {}

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
  update(@Param('id') id: string, @Body() valueDto: InsertGrupoDto) {
    return this.service.update(id, valueDto);
  }

  @Post()
  create(@Body() valueDto: UpdateGrupoDto) {
    return this.service.create(valueDto);
  }
}
