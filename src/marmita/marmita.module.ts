import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Marmita, MarmitaSchema } from './marmita.schema';
import { MarmitaController } from './marmita.controller';
import { MarmitaService } from './marmita.service';
import { PedidoModule } from '../pedido/pedido.module';

@Module({
  controllers: [MarmitaController],
  providers: [MarmitaService],
  exports: [MarmitaService],
  imports: [
    PedidoModule,
    MongooseModule.forFeature([
      {
        name: Marmita.name,
        schema: MarmitaSchema,
      },
    ]),
  ],
})
export class MarmitaModule {}
