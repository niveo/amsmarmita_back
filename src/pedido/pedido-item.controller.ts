import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { PedidoItemService } from './pedido-item.service';

@Controller({
  path: 'pedidoitens',
})
export class PedidoItemController {
  constructor(private readonly service: PedidoItemService) {}

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
  update(@Param('id') id: string, @Body() valueDto: any) {
    return this.service.update(id, valueDto);
  }

  @Post()
  create(@Body() valueDto: any) {
    return this.service.create(valueDto);
  }
}
