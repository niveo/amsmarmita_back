import { UpdateComerdoresDto } from '../dtos/update-comedores.dto';
import { ComedoresService } from '../services/comedores.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { InsertComerdoresDto } from '../dtos/insert-comedores.dto';

@Controller({
  path: 'comedores',
})
export class ComedoresController {
  constructor(private readonly comedoresService: ComedoresService) {}

  @Get()
  getAll() {
    return this.comedoresService.findAll();
  }

  @Get(':id')
  getId(@Param('id') id: string) {
    return this.comedoresService.findById(id);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.comedoresService.delete(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateComerdoresDto: UpdateComerdoresDto,
  ) {
    return this.comedoresService.update(id, updateComerdoresDto);
  }

  @Post()
  create(@Body() insertComerdoresDto: InsertComerdoresDto) {
    return this.comedoresService.create(insertComerdoresDto);
  }
}
