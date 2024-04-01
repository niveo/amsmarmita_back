import { Module, forwardRef } from '@nestjs/common';
import { PedidoService } from './pedido.service';
import { PedidoController } from './pedido.controller';
import { MarmitaModule } from '../marmita/marmita.module';
import { PedidoPratoService } from './pedido-prato.service';
import { PedidoPratoController } from './pedido-prato.controller';
import { MongooseFeatureMogule } from '../common/mongoose-feature.module';

@Module({
  controllers: [PedidoController, PedidoPratoController],
  providers: [PedidoService, PedidoPratoService],
  exports: [PedidoService],
  imports: [forwardRef(() => MarmitaModule), MongooseFeatureMogule],
})
export class PedidoModule {}
