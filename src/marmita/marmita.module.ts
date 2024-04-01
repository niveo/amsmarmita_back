import { Module } from '@nestjs/common';
import { MarmitaController } from './marmita.controller';
import { MarmitaService } from './marmita.service';
import { PedidoModule } from '../pedido/pedido.module';
import { MongooseFeatureMogule } from '../common/mongoose-feature.module';

@Module({
  controllers: [MarmitaController],
  providers: [MarmitaService],
  exports: [MarmitaService],
  imports: [
    PedidoModule,
    MongooseFeatureMogule, 
  ],
})
export class MarmitaModule {}
