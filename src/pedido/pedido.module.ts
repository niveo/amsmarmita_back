import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PedidoService } from './pedido.service';
import { Pedido, PedidoSchema } from './pedido.schema';
import { PedidoPrato, PedidoPratoSchema } from './pedido-prato.schema';
import { PedidoController } from './pedido.controller';
import { MarmitaModule } from '../marmita/marmita.module';
import { PedidoPratoService } from './pedido-prato.service';

@Module({
  controllers: [PedidoController],
  providers: [PedidoService, PedidoPratoService],
  exports: [PedidoService],
  imports: [
    forwardRef(() => MarmitaModule),
    MongooseModule.forFeatureAsync([
      {
        name: Pedido.name,
        useFactory: () => {
          const schema = PedidoSchema;
          schema.pre('save', function() {
            console.log('Hello from pre save');
          });

          return schema;
        },
      },

      {
        name: PedidoPrato.name, useFactory: (pedidoService: PedidoService) => {
          const schema = PedidoPratoSchema;
          schema.pre('deleteOne', function(next) {

          });
          return schema;
        },
      }
    ]),
  ],
})
export class PedidoModule { }
