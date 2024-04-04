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
import { PedidoService } from './pedido.service';

@Controller({
  path: 'pedidos',
})
export class PedidoController {
  constructor(private readonly service: PedidoService) {}

  @Get('/marmitas')
  getByMamitaId(
    @Query('marmitaId') marmitaId: string,
    @Query('comedorId') comedorId: string,
  ) {
    return this.service.carregarItens(marmitaId, comedorId);
  }

  @Get('/relatorio')
  carregarRelatorio(@Query('marmitaId') marmitaId: string) {
    return this.service.carregarRelatorio(marmitaId);
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
  update(@Param('id') id: string, @Body() valueDto: any) {
    return this.service.update(id, valueDto);
  }

  @Post()
  create(@Body() valueDto: any) {
    return this.service.create(valueDto);
  }
}
