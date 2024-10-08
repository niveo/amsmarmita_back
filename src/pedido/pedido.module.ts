import { Module, forwardRef } from '@nestjs/common';
import { PedidoService } from './pedido.service';
import { PedidoController } from './pedido.controller';
import { MarmitaModule } from '../marmita/marmita.module';
import { MongooseFeatureMogule } from '../common/mongoose-feature.module';
import { PedidoItemController } from './pedido-item.controller';
import { PedidoItemService } from './pedido-item.service';
import { ParametroService } from '../services/parametros.service';

@Module({
  controllers: [PedidoController, PedidoItemController],
  providers: [PedidoService, PedidoItemService, ParametroService],
  exports: [PedidoService, PedidoItemService],
  imports: [forwardRef(() => MarmitaModule), MongooseFeatureMogule],
})
export class PedidoModule {}
