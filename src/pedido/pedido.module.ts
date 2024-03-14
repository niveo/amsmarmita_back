import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PedidoService } from './pedido.service';
import { Pedido, PedidoSchema } from './pedido.schema';
import { PedidoPrato, PedidoPratoSchema } from './pedido-prato.schema';
import { PedidoController } from './pedido.controller';

@Module({
  controllers: [PedidoController],
  providers: [PedidoService],
  exports: [PedidoService],
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Pedido.name,
        useFactory: () => {
          const schema = PedidoSchema;
          schema.pre('save', function () {
            console.log('Hello from pre save');
          });

          return schema;
        },
      },

      //{ name: PedidoPrato.name, useFactory: () => PedidoPratoSchema },
    ]),
  ],
})
export class PedidoModule {}
